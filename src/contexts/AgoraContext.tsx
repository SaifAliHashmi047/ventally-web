import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import AgoraRTC, {
  type IAgoraRTCClient,
  type IAgoraRTCRemoteUser,
  type IMicrophoneAudioTrack,
  type IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng';
import type { JoinChannelParams } from '../hooks/useAgoraWeb';

const DEFAULT_APP_ID = 'a5967d92952f4d4c976ff2bdf57853b1';

function resolveAppId(): string {
  if (typeof import.meta !== 'undefined' && (import.meta.env as any)?.VITE_AGORA_APP_ID) {
    return (import.meta.env as any).VITE_AGORA_APP_ID as string;
  }
  return DEFAULT_APP_ID;
}

interface AgoraContextValue {
  joinChannel: (params: JoinChannelParams) => Promise<void>;
  leaveChannel: () => Promise<void>;
  toggleMute: (mute: boolean) => void;
  setSpeakerEnabled: (enabled: boolean) => void;
  isJoined: boolean;
  isConnecting: boolean;
  error: string | null;
}

const AgoraContext = createContext<AgoraContextValue | null>(null);

export function AgoraProvider({ children }: { children: ReactNode }) {
  const appId = resolveAppId();
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const remoteTracksRef = useRef<Set<IRemoteAudioTrack>>(new Set());
  const joiningRef = useRef(false);
  const isJoinedRef = useRef(false);
  // Stores the last successful join params so we can auto-rejoin after mobile suspension
  const lastJoinParamsRef = useRef<JoinChannelParams | null>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // iOS Safari locks the AudioContext until a user gesture. This unlocks it.
  const unlockAudioContext = useCallback(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') void ctx.resume();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch { /* ignore */ }
  }, []);

  // Attach RTC event listeners to a client instance.
  const attachListeners = useCallback((client: IAgoraRTCClient) => {
    const onPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (mediaType !== 'audio' || !clientRef.current) return;
      try {
        await clientRef.current.subscribe(user, 'audio');
        const track = user.audioTrack;
        if (track) {
          remoteTracksRef.current.add(track);
          track.play();
        }
      } catch (e) {
        console.error('[AgoraContext] subscribe error:', e);
      }
    };

    const onUnpublished = (_user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (mediaType !== 'audio') return;
      const track = _user.audioTrack;
      if (track) {
        remoteTracksRef.current.delete(track);
        try { track.stop(); } catch { /* ignore */ }
      }
    };

    const onUserLeft = (user: IAgoraRTCRemoteUser) => {
      const track = user.audioTrack;
      if (track) remoteTracksRef.current.delete(track);
    };

    // Sync our state with the real Agora connection state.
    // On mobile, iOS/Android can drop the WebRTC connection when backgrounded —
    // this ensures our isJoined state reflects reality, not stale refs.
    const onConnectionStateChange = (curState: string) => {
      console.log('[AgoraContext] connection state ->', curState);
      if (curState === 'DISCONNECTED') {
        isJoinedRef.current = false;
        joiningRef.current = false;
        setIsJoined(false);
        setIsConnecting(false);
      } else if (curState === 'CONNECTED') {
        isJoinedRef.current = true;
        setIsJoined(true);
        setIsConnecting(false);
      } else if (curState === 'CONNECTING' || curState === 'RECONNECTING') {
        setIsConnecting(true);
      }
    };

    client.on('user-published', onPublished);
    client.on('user-unpublished', onUnpublished);
    client.on('user-left', onUserLeft);
    client.on('connection-state-change', onConnectionStateChange);
  }, []);

  // h264 is required for iOS Safari — VP8 is not supported on iOS at all.
  const createFreshClient = useCallback(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264' });
    attachListeners(client);
    clientRef.current = client;
    return client;
  }, [attachListeners]);

  useEffect(() => {
    createFreshClient();
    return () => {
      const client = clientRef.current;
      if (!client) return;
      void (async () => {
        try {
          if (localTrackRef.current) {
            try { await client.unpublish(); } catch { /* ignore */ }
            localTrackRef.current.stop();
            localTrackRef.current.close();
            localTrackRef.current = null;
          }
          remoteTracksRef.current.forEach((t) => { try { t.stop(); } catch { /* ignore */ } });
          remoteTracksRef.current.clear();
          if (client.connectionState !== 'DISCONNECTED') await client.leave();
        } catch { /* ignore */ }
        client.removeAllListeners();
        clientRef.current = null;
      })();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinChannel = useCallback(async (params: JoinChannelParams) => {
    const channel = params.channelName?.trim();
    if (!channel) { setError('Channel name is required'); return; }

    // Unlock AudioContext on iOS — must be inside a user-gesture call stack.
    unlockAudioContext();

    if (!clientRef.current) createFreshClient();
    const client = clientRef.current!;

    // Guard: skip only if we are ACTUALLY connected — not just if the ref says so.
    // On mobile, the OS can drop the WebRTC connection while our ref still says joined.
    const actuallyConnected = isJoinedRef.current && client.connectionState === 'CONNECTED';
    if (joiningRef.current || actuallyConnected) return;

    // If we think we're joined but Agora says disconnected, clean up first
    if (isJoinedRef.current && client.connectionState === 'DISCONNECTED') {
      isJoinedRef.current = false;
      joiningRef.current = false;
      if (localTrackRef.current) {
        try { localTrackRef.current.stop(); localTrackRef.current.close(); } catch { /* ignore */ }
        localTrackRef.current = null;
      }
    }

    joiningRef.current = true;
    setError(null);
    setIsConnecting(true);
    setIsJoined(false);

    try {
      const uidArg = params.uid === undefined || params.uid === null ? null : Number(params.uid);
      await client.join(appId, channel, params.token || null, uidArg);
      // Mobile-friendly mic constraints: AEC/ANS/AGC help with earpiece feedback.
      // Permission should already be granted from the button-click handler upstream,
      // but createMicrophoneAudioTrack will surface a clear error if not.
      const mic = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: 'speech_standard',
        AEC: true,
        ANS: true,
        AGC: true,
      });
      localTrackRef.current = mic;
      await client.publish([mic]);
      isJoinedRef.current = true;
      lastJoinParamsRef.current = params; // save for auto-rejoin on visibility restore
      setIsJoined(true);
      setIsConnecting(false);
    } catch (e) {
      console.error('[AgoraContext] join error:', e);
      setError(e instanceof Error ? e.message : String(e));
      setIsConnecting(false);
      isJoinedRef.current = false;
      setIsJoined(false);
      try {
        if (localTrackRef.current) {
          localTrackRef.current.stop();
          localTrackRef.current.close();
          localTrackRef.current = null;
        }
        await client.leave();
      } catch { /* ignore */ }
    } finally {
      joiningRef.current = false;
    }
  }, [appId, createFreshClient, unlockAudioContext]);

  // Auto-rejoin when the page returns to the foreground after mobile suspension.
  // iOS/Android kill WebRTC connections when the browser tab is backgrounded.
  // When the user returns, we detect the dead connection and rejoin automatically.
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== 'visible') return;
      const params = lastJoinParamsRef.current;
      if (!params || joiningRef.current) return;

      // Small delay to let iOS restore the audio session before we try to join
      await new Promise<void>((r) => setTimeout(r, 600));

      const client = clientRef.current;
      if (!client) return;

      if (client.connectionState === 'DISCONNECTED') {
        console.log('[AgoraContext] tab restored with dead connection — rejoining');
        void joinChannel(params);
      } else if (client.connectionState === 'CONNECTED' && !isJoinedRef.current) {
        // Connection alive but state out of sync — re-sync
        isJoinedRef.current = true;
        setIsJoined(true);
        setIsConnecting(false);
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [joinChannel]);

  const leaveChannel = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    lastJoinParamsRef.current = null; // clear — no auto-rejoin after explicit leave
    isJoinedRef.current = false;
    joiningRef.current = false;
    setIsJoined(false);
    setIsConnecting(false);

    try {
      if (localTrackRef.current) {
        try { await client.unpublish(); } catch { /* ignore */ }
        localTrackRef.current.stop();
        localTrackRef.current.close();
        localTrackRef.current = null;
      }
      remoteTracksRef.current.forEach((t) => { try { t.stop(); } catch { /* ignore */ } });
      remoteTracksRef.current.clear();
      if (client.connectionState !== 'DISCONNECTED') await client.leave();
    } catch (e) {
      console.error('[AgoraContext] leave error:', e);
    }

    client.removeAllListeners();
    clientRef.current = null;
    createFreshClient();
  }, [createFreshClient]);

  const toggleMute = useCallback((mute: boolean) => {
    try { localTrackRef.current?.setMuted(mute); } catch (e) {
      console.error('[AgoraContext] mute error:', e);
    }
  }, []);

  // Switches audio output device (loudspeaker vs earpiece) on browsers that support setSinkId
  // (Chrome/Android). On iOS Safari setSinkId is unsupported — we fall back to volume only.
  const setSpeakerEnabled = useCallback((enabled: boolean) => {
    const volume = enabled ? 100 : 0;

    const applyVolume = () => {
      remoteTracksRef.current.forEach((track) => {
        try { track.setVolume(volume); } catch { /* ignore */ }
      });
    };

    // enumerateDevices requires an existing media permission — we have mic, so labels are visible.
    const canEnumerate =
      typeof navigator !== 'undefined' &&
      typeof navigator.mediaDevices?.enumerateDevices === 'function' &&
      // setSinkId / setPlaybackDevice is not supported on Safari/iOS
      typeof (document.createElement('audio') as any).setSinkId === 'function';

    if (!canEnumerate) {
      applyVolume();
      return;
    }

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const outputs = devices.filter((d) => d.kind === 'audiooutput');

      let targetId: string;
      if (enabled) {
        // Prefer an explicit speakerphone/loudspeaker device; fall back to 'default'
        const loud =
          outputs.find((d) => /speaker/i.test(d.label)) ||
          outputs.find((d) => d.deviceId !== 'default' && d.deviceId !== 'communications') ||
          outputs[0];
        targetId = loud?.deviceId ?? 'default';
      } else {
        // Prefer the 'communications' device (earpiece on Android) or default
        const ear =
          outputs.find((d) => d.deviceId === 'communications') ||
          outputs.find((d) => /earpiece|ear/i.test(d.label)) ||
          outputs.find((d) => d.deviceId === 'default') ||
          outputs[0];
        targetId = ear?.deviceId ?? 'communications';
      }

      applyVolume();
      remoteTracksRef.current.forEach((track) => {
        track.setPlaybackDevice(targetId).catch(() => { /* unsupported on this browser */ });
      });
    }).catch(() => {
      // enumerateDevices failed — fall back to volume only
      applyVolume();
    });
  }, []);

  return (
    <AgoraContext.Provider value={{ joinChannel, leaveChannel, toggleMute, setSpeakerEnabled, isJoined, isConnecting, error }}>
      {children}
    </AgoraContext.Provider>
  );
}

export function useAgoraContext() {
  const ctx = useContext(AgoraContext);
  if (!ctx) throw new Error('useAgoraContext must be used within AgoraProvider');
  return ctx;
}

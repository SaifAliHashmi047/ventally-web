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

  const [isJoined, setIsJoined] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Attach the three RTC event listeners to a client instance.
  // Uses refs so the handlers always read the latest clientRef.
  const attachListeners = useCallback((client: IAgoraRTCClient) => {
    const onPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (mediaType !== 'audio' || !clientRef.current) return;
      try {
        await clientRef.current.subscribe(user, 'audio');
        const track = user.audioTrack;
        if (track) {
          remoteTracksRef.current.add(track);
          await track.play();
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

    client.on('user-published', onPublished);
    client.on('user-unpublished', onUnpublished);
    client.on('user-left', onUserLeft);
  }, []);

  // Create a fresh client and wire up its listeners
  const createFreshClient = useCallback(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
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
          if (client.connectionState !== 'DISCONNECTED') {
            await client.leave();
          }
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

    // Re-create client if it was destroyed after a previous leaveChannel
    if (!clientRef.current) createFreshClient();
    const client = clientRef.current!;

    if (joiningRef.current || isJoinedRef.current) return;

    joiningRef.current = true;
    setError(null);
    setIsConnecting(true);

    try {
      const uidArg = params.uid === undefined || params.uid === null ? null : Number(params.uid);
      await client.join(appId, channel, params.token || null, uidArg);
      const mic = await AgoraRTC.createMicrophoneAudioTrack();
      localTrackRef.current = mic;
      await client.publish([mic]);
      isJoinedRef.current = true;
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
  }, [appId, createFreshClient]);

  const leaveChannel = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    // Mark as not joined immediately so any concurrent checks see the correct state
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
      if (client.connectionState !== 'DISCONNECTED') {
        await client.leave();
      }
    } catch (e) {
      console.error('[AgoraContext] leave error:', e);
    }

    // Fully destroy the old client so it stops all internal stats/heartbeat traffic
    client.removeAllListeners();
    clientRef.current = null;

    // Spin up a fresh client ready for the next session
    createFreshClient();
  }, [createFreshClient]);

  const toggleMute = useCallback((mute: boolean) => {
    try { localTrackRef.current?.setMuted(mute); } catch (e) {
      console.error('[AgoraContext] mute error:', e);
    }
  }, []);

  return (
    <AgoraContext.Provider value={{ joinChannel, leaveChannel, toggleMute, isJoined, isConnecting, error }}>
      {children}
    </AgoraContext.Provider>
  );
}

export function useAgoraContext() {
  const ctx = useContext(AgoraContext);
  if (!ctx) throw new Error('useAgoraContext must be used within AgoraProvider');
  return ctx;
}

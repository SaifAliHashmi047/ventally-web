/**
 * useAgoraWeb – join/leave Agora voice channels in the browser (agora-rtc-sdk-ng).
 * Mirrors the RN useAgora API shape; callbacks are stored in refs.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import AgoraRTC, {
  type IAgoraRTCClient,
  type IAgoraRTCRemoteUser,
  type IMicrophoneAudioTrack,
  type IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng';

const DEFAULT_APP_ID = 'a5967d92952f4d4c976ff2bdf57853b1';

export interface UseAgoraWebOptions {
  appId?: string;
  onJoinChannelSuccess?: (channel: string, uid: number) => void;
  onUserJoined?: (uid: number) => void;
  onUserOffline?: (uid: number) => void;
  onError?: (err: unknown) => void;
}

export interface JoinChannelParams {
  token: string;
  channelName: string;
  uid?: number | null;
}

/** Shape of `call` from socket / accept API (venter + listener). */
export type AgoraCallPayload = {
  token?: string;
  channelName?: string;
  roomName?: string;
  uid?: number | null;
};

export function joinParamsFromCallPayload(raw: AgoraCallPayload | null | undefined): JoinChannelParams | null {
  if (!raw) return null;
  const channelName = (raw.channelName || raw.roomName || '').trim();
  if (!channelName) return null;
  return {
    token: raw.token ?? '',
    channelName,
    uid: raw.uid ?? null,
  };
}

function resolveAppId(override?: string): string {
  if (override) return override;
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AGORA_APP_ID) {
    return import.meta.env.VITE_AGORA_APP_ID as string;
  }
  return DEFAULT_APP_ID;
}

export function useAgoraWeb(options: UseAgoraWebOptions = {}) {
  const appId = resolveAppId(options.appId);

  const onJoinRef = useRef(options.onJoinChannelSuccess);
  const onUserJoinedRef = useRef(options.onUserJoined);
  const onUserOfflineRef = useRef(options.onUserOffline);
  const onErrorRef = useRef(options.onError);
  onJoinRef.current = options.onJoinChannelSuccess;
  onUserJoinedRef.current = options.onUserJoined;
  onUserOfflineRef.current = options.onUserOffline;
  onErrorRef.current = options.onError;

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const remoteTracksRef = useRef<Set<IRemoteAudioTrack>>(new Set());
  const joiningRef = useRef(false);

  const [isJoined, setIsJoined] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    const onPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (mediaType !== 'audio' || !clientRef.current) return;
      try {
        await clientRef.current.subscribe(user, 'audio');
        const track = user.audioTrack;
        if (track) {
          remoteTracksRef.current.add(track);
          await track.play();
          setRemoteUid(typeof user.uid === 'number' ? user.uid : Number(user.uid));
          onUserJoinedRef.current?.(typeof user.uid === 'number' ? user.uid : Number(user.uid));
        }
      } catch (e) {
        console.error('[AgoraWeb] subscribe error:', e);
        onErrorRef.current?.(e);
      }
    };

    const onUnpublished = (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (mediaType !== 'audio') return;
      const track = user.audioTrack;
      if (track) {
        remoteTracksRef.current.delete(track);
        try {
          track.stop();
        } catch {
          /* ignore */
        }
      }
      setRemoteUid((prev) => {
        const u = typeof user.uid === 'number' ? user.uid : Number(user.uid);
        return prev === u ? null : prev;
      });
    };

    const onUserLeft = (user: IAgoraRTCRemoteUser) => {
      const track = user.audioTrack;
      if (track) {
        remoteTracksRef.current.delete(track);
      }
      setRemoteUid((prev) => {
        const u = typeof user.uid === 'number' ? user.uid : Number(user.uid);
        return prev === u ? null : prev;
      });
      onUserOfflineRef.current?.(typeof user.uid === 'number' ? user.uid : Number(user.uid));
    };

    client.on('user-published', onPublished);
    client.on('user-unpublished', onUnpublished);
    client.on('user-left', onUserLeft);

    return () => {
      client.off('user-published', onPublished);
      client.off('user-unpublished', onUnpublished);
      client.off('user-left', onUserLeft);

      void (async () => {
        try {
          if (localTrackRef.current && client.connectionState !== 'DISCONNECTED') {
            await client.unpublish();
            localTrackRef.current.stop();
            localTrackRef.current.close();
            localTrackRef.current = null;
          }
          remoteTracksRef.current.forEach((t) => {
            try {
              t.stop();
            } catch {
              /* ignore */
            }
          });
          remoteTracksRef.current.clear();
          if (client.connectionState !== 'DISCONNECTED') {
            await client.leave();
          }
        } catch {
          /* ignore */
        }
        client.removeAllListeners();
        clientRef.current = null;
      })();
    };
  }, []);

  const joinChannel = useCallback(
    async (params: JoinChannelParams) => {
      const channel = params.channelName?.trim();
      if (!channel) {
        setError('Channel name is required');
        return;
      }
      const client = clientRef.current;
      if (!client || joiningRef.current) {
        if (!client) setError('Agora client not ready');
        return;
      }

      joiningRef.current = true;
      setError(null);
      setIsConnecting(true);

      try {
        const uidArg =
          params.uid === undefined || params.uid === null ? null : Number(params.uid);

        await client.join(appId, channel, params.token || null, uidArg);

        const mic = await AgoraRTC.createMicrophoneAudioTrack();
        localTrackRef.current = mic;
        await client.publish([mic]);

        const localUid = client.uid != null ? Number(client.uid) : uidArg ?? 0;
        setIsJoined(true);
        setIsConnecting(false);
        onJoinRef.current?.(channel, localUid);
      } catch (e) {
        console.error('[AgoraWeb] join error:', e);
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        setIsConnecting(false);
        setIsJoined(false);
        onErrorRef.current?.(e);
        try {
          if (localTrackRef.current) {
            localTrackRef.current.stop();
            localTrackRef.current.close();
            localTrackRef.current = null;
          }
          await client.leave();
        } catch {
          /* ignore */
        }
      } finally {
        joiningRef.current = false;
      }
    },
    [appId],
  );

  const leaveChannel = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    try {
      if (localTrackRef.current) {
        await client.unpublish();
        localTrackRef.current.stop();
        localTrackRef.current.close();
        localTrackRef.current = null;
      }
      remoteTracksRef.current.forEach((t) => {
        try {
          t.stop();
        } catch {
          /* ignore */
        }
      });
      remoteTracksRef.current.clear();
      if (client.connectionState !== 'DISCONNECTED') {
        await client.leave();
      }
    } catch (e) {
      console.error('[AgoraWeb] leave error:', e);
    } finally {
      setIsJoined(false);
      setRemoteUid(null);
      setIsConnecting(false);
    }
  }, []);

  const toggleMute = useCallback((mute: boolean) => {
    try {
      localTrackRef.current?.setMuted(mute);
    } catch (e) {
      console.error('[AgoraWeb] mute error:', e);
    }
  }, []);

  /** Mutes remote playback (speaker), not the microphone. Volume range 0–100 per Agora Web SDK. */
  const setSpeakerMuted = useCallback((muted: boolean) => {
    const vol = muted ? 0 : 100;
    remoteTracksRef.current.forEach((track) => {
      try {
        track.setVolume(vol);
      } catch {
        /* ignore */
      }
    });
  }, []);

  return {
    joinChannel,
    leaveChannel,
    toggleMute,
    setSpeakerMuted,
    isJoined,
    isConnecting,
    remoteUid,
    error,
  };
}

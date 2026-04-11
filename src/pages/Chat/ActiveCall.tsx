import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Mic, MicOff, Volume2, VolumeX, Phone, MessageSquare, Clock } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import apiInstance from '../../api/apiInstance';

export const ActiveCall = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';

  const [muted, setMuted] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  // Timer
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  useEffect(() => {
    // Simulated connection — replace with actual WebRTC/Agora signaling
    const timer = setTimeout(() => setCallStatus('connected'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    try {
      await apiInstance.post(`sessions/${roomId}/end`);
    } catch { /* ignore */ }
    navigate(`/${role}/session/${roomId}/feedback`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-12 px-4 bg-bg-deep"
      style={{ background: 'radial-gradient(ellipse at center, rgba(194,174,191,0.08) 0%, #000 60%)' }}>

      {/* Top Bar */}
      <div className="flex justify-between items-center w-full max-w-sm">
        <p className="text-sm text-gray-500">Session Call</p>
        <div className="badge badge-success">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          {callStatus === 'connected' ? 'Connected' : 'Connecting...'}
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full glass-accent flex items-center justify-center text-4xl font-bold text-white">
            L
          </div>
          {callStatus === 'connected' && (
            <div className="absolute inset-0 rounded-full border-2 border-accent/40 animate-ping" />
          )}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Your Listener</h2>
          <p className="text-sm text-gray-500 mt-1">
            {callStatus === 'connecting' ? 'Connecting...' : formatDuration(duration)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6 w-full max-w-sm">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setMuted(!muted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              muted ? 'bg-error/20 border border-error/40 text-error' : 'glass text-white hover:bg-white/8'
            }`}
          >
            {muted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <button
            onClick={handleEndCall}
            className="w-20 h-20 rounded-full bg-error flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
          >
            <Phone size={26} className="rotate-[135deg]" />
          </button>

          <button
            onClick={() => setSpeakerOff(!speakerOff)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              speakerOff ? 'bg-error/20 border border-error/40 text-error' : 'glass text-white hover:bg-white/8'
            }`}
          >
            {speakerOff ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

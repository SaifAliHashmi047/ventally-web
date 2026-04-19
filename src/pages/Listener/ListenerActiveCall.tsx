import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Mic, MicOff, PhoneOff, Plus, Heart } from 'lucide-react';
import socketService from '../../api/socketService';

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const ListenerActiveCall = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);

  useEffect(() => {
    // Connect socket when entering call
    socketService.connect();
    
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEndCall = () => {
    setShowEndModal(true);
  };

  const confirmEndCall = () => {
    setShowEndModal(false);
    setShowSessionEndedModal(true);
    
    setTimeout(() => {
      setShowSessionEndedModal(false);
      navigate('/listener/session/feedback', { state: { type: 'call' } });
    }, 2000);
  };

  // Listen for remote end via socket (when other party ends the call)
  useEffect(() => {
    if (!roomId) return;

    const handleCallEnded = (data: any) => {
      console.log('[ListenerActiveCall] call:ended from socket:', data);
      navigate('/listener/session/feedback', { replace: true, state: { type: 'call' } });
    };

    socketService.on('call:ended', handleCallEnded);
    return () => {
      socketService.off('call:ended', handleCallEnded);
    };
  }, [roomId, navigate]);

  return (
    <div className="page-wrapper animate-fade-in relative min-h-screen flex flex-col items-center pt-10">
      <div className="w-full absolute top-0 left-0 p-4">
        <PageHeader title="" onBack={() => navigate(-1)} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mt-10">
        {/* Caller Avatar */}
        <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/5 shadow-[0_0_40px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <span className="text-4xl font-bold text-white">V</span>
        </div>

        {/* Timer */}
        <h2 className="text-4xl font-light tracking-wider text-white mb-2">{formatDuration(seconds)}</h2>
        <p className="text-sm font-medium text-white/60 animate-pulse">{t('ListenerCall.connecting', 'Connecting...')}</p>

        {/* Controls Panel */}
        <GlassCard className="absolute bottom-10 w-full max-w-[90%] left-1/2 -translate-x-1/2 flex items-center justify-around py-6 rounded-3xl bg-black/40 border-white/10">
          
          {/* Mute */}
          <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center transition-all group-hover:bg-white/20">
              {isMuted ? <MicOff size={24} className="text-error" /> : <Mic size={24} className="text-white" />}
            </div>
            <span className="text-xs font-medium text-white">{isMuted ? t('ListenerCall.unmute', 'Unmute') : t('ListenerCall.mute', 'Mute')}</span>
          </button>

          {/* Crisis */}
          <button onClick={() => navigate('/listener/crisis-escalation')} className="flex flex-col items-center gap-2 group transform -translate-y-4">
            <div className="w-[72px] h-[72px] rounded-full bg-error flex items-center justify-center shadow-[0_0_30px_rgba(255,59,48,0.4)] transition-transform group-hover:scale-105">
              <Plus size={36} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-white">{t('ListenerCall.crisis', 'Crisis')}</span>
          </button>

          {/* End Call */}
          <button onClick={handleEndCall} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center transition-all group-hover:bg-white/20">
              <PhoneOff size={24} className="text-white" />
            </div>
            <span className="text-xs font-medium text-white">{t('ListenerCall.end', 'End')}</span>
          </button>
        </GlassCard>
      </div>

      {/* End Call Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-sm rounded-3xl p-6 text-center transform animate-scale-up">
            <h3 className="text-xl font-bold text-white mb-2">{t('ListenerCall.endSession', 'End Session?')}</h3>
            <p className="text-sm text-gray-400 mb-6">{t('ListenerCall.endSessionConfirm', 'Are you sure you want to end this session?')}</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowEndModal(false)}
                className="py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                {t('Common.no', 'No')}
              </button>
              <button 
                onClick={confirmEndCall}
                className="py-3 rounded-2xl bg-error text-white font-medium hover:bg-error/90 transition-colors shadow-[0_0_20px_rgba(255,59,48,0.3)]"
              >
                {t('Common.yes', 'Yes')}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Session Ended Modal */}
      {showSessionEndedModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <GlassCard className="w-full max-w-sm rounded-3xl p-8 text-center transform animate-scale-up border-primary/30">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-primary fill-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('ListenerCall.sessionEnded', 'Session Ended')}</h3>
            <p className="text-base text-gray-400">{t('ListenerCall.thanksMessage', 'Thanks for being here. You made a difference.')}</p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Phone, MessageSquare, ChevronRight } from 'lucide-react';
import type { RootState } from '../../store/store';

function formatElapsed(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface ActiveSessionBarProps {
  role: 'venter' | 'listener';
}

export const ActiveSessionBar = ({ role }: ActiveSessionBarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isCallActive = useSelector((s: RootState) => s.call.isActive);
  const isChatActive = useSelector((s: RootState) => s.call.isChatActive);
  const callStartTime = useSelector((s: RootState) => s.call.startTime);
  const chatStartTime = useSelector((s: RootState) => s.call.chatStartTime);
  const sessionId = useSelector((s: RootState) => s.call.sessionId);
  const conversationId = useSelector((s: RootState) => s.call.activeConversationId);

  const [, setTick] = useState(0);

  const startTime = isCallActive ? callStartTime : isChatActive ? chatStartTime : null;

  useEffect(() => {
    if (!startTime) return;
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const isActive = isCallActive || isChatActive;
  if (!isActive) return null;

  // Hide bar when already on the active screen
  const onCallScreen = location.pathname.startsWith(`/${role}/call/`);
  const onChatScreen =
    location.pathname.startsWith(`/${role}/chat/`) &&
    !location.pathname.endsWith('/all');
  if ((isCallActive && onCallScreen) || (isChatActive && onChatScreen)) return null;

  const handleReturn = () => {
    if (isCallActive && sessionId) {
      navigate(`/${role}/call/${sessionId}`);
    } else if (isChatActive && conversationId) {
      navigate(`/${role}/chat/${conversationId}`);
    }
  };

  const elapsed = startTime ? Date.now() - startTime : 0;

  return (
    <button
      onClick={handleReturn}
      className="w-full flex items-center gap-3 px-4 py-2.5 bg-primary/20 border-b border-primary/30 backdrop-blur-sm hover:bg-primary/30 active:bg-primary/40 transition-colors text-left"
    >
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />

      {isCallActive ? (
        <Phone size={14} className="text-primary flex-shrink-0" />
      ) : (
        <MessageSquare size={14} className="text-primary flex-shrink-0" />
      )}

      <span className="text-sm font-medium text-white flex-1 min-w-0 truncate">
        {isCallActive
          ? t('SessionBar.callActive', 'Call in progress')
          : t('SessionBar.chatActive', 'Chat in progress')}
      </span>

      {isCallActive && startTime && (
        <span className="text-xs text-white/60 tabular-nums flex-shrink-0">
          {formatElapsed(elapsed)}
        </span>
      )}

      <div className="flex items-center gap-0.5 text-primary flex-shrink-0">
        <span className="text-xs font-semibold">{t('SessionBar.return', 'Return')}</span>
        <ChevronRight size={14} />
      </div>
    </button>
  );
};

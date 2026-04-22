import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';

interface Message {
  id: string;
  text: string;
  isOutgoing: boolean;
  sender: string;
  timestamp: string;
}

const MESSAGES: Message[] = [
  { id: '1', text: 'Hi Justin how are you?',                             isOutgoing: true,  sender: 'User 1', timestamp: 'SAT AT 12:34 PM' },
  { id: '2', text: "Hello Moni I'm fine",                                isOutgoing: false, sender: 'User 2', timestamp: 'SAT AT 12:34 PM' },
  { id: '3', text: 'I need one help please?',                            isOutgoing: true,  sender: 'User 1', timestamp: 'SAT AT 12:34 PM' },
  { id: '4', text: 'Yes! Please let me know how can I help you',         isOutgoing: false, sender: 'User 2', timestamp: 'SAT AT 12:35 PM' },
  { id: '5', text: 'How I can use Ventally?',                            isOutgoing: true,  sender: 'User 1', timestamp: 'SAT AT 12:35 PM' },
];

export const AdminCrisisDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const log = location.state?.log;

  return (
    <div className="page-wrapper animate-fade-in max-w-2xl mx-auto flex flex-col h-screen">
      <PageHeader
        title={t('Admin.moderation.chat.title', 'Crisis Chat')}
        subtitle="Safe & Anonymous"
        onBack={() => navigate('/admin/crisis')}
      />

      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-6 pb-8">
        {MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isOutgoing ? 'items-end' : 'items-start'}`}
          >
            <p className={`text-xs font-bold text-white/50 mb-1 ${msg.isOutgoing ? 'text-right' : ''}`}>
              {msg.sender}
            </p>
            <p className="text-[10px] text-white/40 mb-1">abc@gmail.com</p>

            <GlassCard
              className={`max-w-[72%] px-4 py-3 rounded-2xl ${
                msg.isOutgoing
                  ? 'bg-white/[0.09] rounded-tr-sm'
                  : 'bg-white/[0.02] rounded-tl-sm'
              }`}
            >
              <p className="text-sm text-white leading-relaxed">{msg.text}</p>
            </GlassCard>

            <p className="text-[10px] text-white/30 font-medium mt-1">{msg.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

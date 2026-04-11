import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useSessions } from '../../api/hooks/useSessions';
import { Star } from 'lucide-react';

const TOPICS = ['Anxiety', 'Relationships', 'Work Stress', 'Depression', 'Family', 'Loneliness', 'Other'];

export const SessionFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { submitFeedback } = useSessions();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleTopic = (t: string) => setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitFeedback(id!, { rating, comment, topics });
      navigate(`/${location.pathname.split('/')[1]}/session/${id}/rating`, { replace: true });
    } catch { /* ignore */ } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Session Feedback" />

      <GlassCard bordered>
        <p className="text-center text-sm text-gray-400 mb-4">How was your session?</p>

        {/* Star Rating */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setRating(n)}>
              <Star
                size={32}
                className={`transition-all ${n <= rating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-600'}`}
              />
            </button>
          ))}
        </div>

        {/* Topics */}
        <p className="section-label mb-3">Topics discussed</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {TOPICS.map(t => (
            <button key={t} onClick={() => toggleTopic(t)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-all ${
                topics.includes(t) ? 'bg-accent/15 text-accent border border-accent/25' : 'glass text-gray-400'
              }`}
            >{t}</button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Anything else you'd like to share? (optional)"
          className="input-field w-full h-24 resize-none"
        />
      </GlassCard>

      <Button variant="primary" size="lg" fullWidth loading={submitting} onClick={handleSubmit}>
        Submit Feedback
      </Button>
      <Button variant="ghost" fullWidth onClick={() => navigate(-1)}>Skip</Button>
    </div>
  );
};

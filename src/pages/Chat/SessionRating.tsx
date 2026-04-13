import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useSessions } from '../../api/hooks/useSessions';
import { Star, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

export const SessionRating = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { submitRating } = useSessions();
  const user = useSelector((state: RootState) => state.user.user as any);
  const role = user?.userType || 'venter';

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitRating(id!, rating, review || undefined);
      setDone(true);
    } catch { /* ignore */ } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-success" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-6">Your rating helps us improve the Ventally experience.</p>
          <Button variant="primary" onClick={() => navigate(`/${role}/home`)}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white">Rate Your Listener</h2>
          <p className="text-gray-500 mt-1">How was your experience?</p>
        </div>

        <GlassCard bordered>
          {/* Stars */}
          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setRating(n)}>
                <Star
                  size={36}
                  className={`transition-all duration-150 ${n <= rating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-600 hover:text-gray-400'}`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-center text-sm font-medium text-white mb-4">
              {rating === 5 ? '⭐ Excellent!' : rating === 4 ? '👍 Great' : rating === 3 ? '😊 Good' : rating === 2 ? '😐 Fair' : '😞 Poor'}
            </p>
          )}

          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder="Share your experience... (optional)"
            className="input-field w-full h-24 resize-none"
          />
        </GlassCard>

        <div className="mt-4 space-y-3">
          <Button variant="primary" size="lg" fullWidth loading={submitting} disabled={rating === 0} onClick={handleSubmit}>
            Submit Rating
          </Button>
          <Button variant="ghost" fullWidth onClick={() => navigate(`/${role}/home`)}>Skip</Button>
        </div>
      </div>
    </div>
  );
};

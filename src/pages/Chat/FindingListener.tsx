import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Loader2, Search, X, Headphones } from 'lucide-react';
import apiInstance from '../../api/apiInstance';

export const FindingListener = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type || 'call';

  const [status, setStatus] = useState<'searching' | 'found' | 'timeout'>('searching');
  const [dots, setDots] = useState('');

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(interval);
  }, []);

  // Timeout after 60 seconds
  useEffect(() => {
    const timeout = setTimeout(() => setStatus('timeout'), 60000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await apiInstance.post('sessions/request', { sessionType: type });
      } catch (e) {
        console.error('Session request failed:', e);
      }
    };
    init();
  }, [type]);

  const handleCancel = async () => {
    try {
      await apiInstance.post('sessions/cancel-request');
    } catch { /* ignore */ }
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm w-full animate-fade-in">
        {/* Animated Ring */}
        <div className="relative w-36 h-36 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
          <div className="absolute inset-4 rounded-full border-2 border-accent/30 animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute inset-8 rounded-full border-2 border-accent/40 animate-ping" style={{ animationDelay: '0.6s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full glass-accent flex items-center justify-center">
              <Headphones size={32} className="text-accent" />
            </div>
          </div>
        </div>

        {status === 'searching' && (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Finding a Listener{dots}</h1>
            <p className="text-gray-500 mb-8">We're connecting you with an available listener for your {type} session.</p>
            <Button variant="glass" onClick={handleCancel} leftIcon={<X size={16} />}>
              Cancel
            </Button>
          </>
        )}

        {status === 'timeout' && (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">No Listeners Available</h1>
            <p className="text-gray-500 mb-8">All listeners are currently busy. Please try again in a few minutes.</p>
            <div className="space-y-3">
              <Button variant="primary" fullWidth onClick={() => setStatus('searching')}>Try Again</Button>
              <Button variant="glass" fullWidth onClick={() => navigate(-1)}>Go Back</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

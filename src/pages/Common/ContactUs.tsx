import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import apiInstance from '../../api/apiInstance';
import { MessageCircle, Mail, CheckCircle } from 'lucide-react';

const TOPICS = ['Technical Issue', 'Account Problem', 'Billing Issue', 'Report Abuse', 'Feedback', 'Other'];

export const ContactUs = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ topic: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!form.topic || !form.message.trim()) {
      setError('Please select a topic and write a message.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await apiInstance.post('contact-us', form);
      setSent(true);
    } catch { setError('Failed to send. Please try again.'); } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="page-wrapper animate-fade-in">
        <PageHeader title="Contact Us" onBack={() => navigate(-1)} />
        <GlassCard bordered className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-success" />
          </div>
          <p className="text-lg font-bold text-white mb-2">Message Sent!</p>
          <p className="text-sm text-gray-500 mb-6">Our team will get back to you within 24 hours.</p>
          <Button variant="primary" onClick={() => navigate(-1)}>Done</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Contact Us" onBack={() => navigate(-1)} />

      <GlassCard bordered>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl glass-accent flex items-center justify-center">
            <MessageCircle size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">How can we help?</p>
            <p className="text-xs text-gray-500">Typical response time: 24 hours</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-2">Topic</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TOPICS.map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, topic: t }))}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                    form.topic === t ? 'bg-accent/15 text-accent border border-accent/25' : 'glass text-gray-400 hover:bg-white/5'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1.5">Message</p>
            <textarea
              value={form.message}
              onChange={e => { setForm(p => ({ ...p, message: e.target.value })); setError(''); }}
              placeholder="Describe your issue or question in detail..."
              className="input-field w-full h-36 resize-none"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
        </div>
      </GlassCard>

      <Button variant="primary" size="lg" fullWidth loading={sending} leftIcon={<Mail size={16} />} onClick={handleSend}>
        Send Message
      </Button>
    </div>
  );
};

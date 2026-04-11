import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { useReflections } from '../../api/hooks/useReflections';
import { PenLine } from 'lucide-react';

export const VenterAddReflection = () => {
  const navigate = useNavigate();
  const { addReflection } = useReflections();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await addReflection(text.trim());
      navigate('/venter/reflections');
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="New Reflection" />

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl glass-accent flex items-center justify-center">
          <PenLine size={16} className="text-accent" />
        </div>
        <div>
          <p className="text-base font-semibold text-white">How are you feeling today?</p>
          <p className="text-xs text-gray-500">Write freely — this is your private space</p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What's on your mind? Share your thoughts, feelings, or insights..."
        className="input-field w-full min-h-64 resize-none text-base leading-relaxed"
        autoFocus
        maxLength={2000}
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-600">{text.length}/2000</p>
        <p className="text-xs text-gray-600">{new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={saving}
        disabled={!text.trim()}
        onClick={handleSave}
      >
        Save Reflection
      </Button>
    </div>
  );
};

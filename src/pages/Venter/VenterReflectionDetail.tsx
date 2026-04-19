import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useReflections } from '../../api/hooks/useReflections';
import { toastSuccess, toastError } from '../../utils/toast';
import { BookOpen, Edit, Trash2, Calendar } from 'lucide-react';

export const VenterReflectionDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const reflection = location.state?.reflection;
  const { updateReflection, deleteReflection } = useReflections();

  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState(reflection?.reflection_text ?? '');
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!reflection) {
    navigate('/venter/reflections');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateReflection(reflection.id, text);
      toastSuccess(t('VenterHome.reflectionSuccess.message'));
      setEditMode(false);
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteReflection(reflection.id);
      toastSuccess(t('VenterHome.delete'));
      navigate('/venter/reflections');
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title="Reflection"
        onBack={() => navigate('/venter/reflections')}
        rightContent={
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setDeleteModal(true)}
              className="p-2 rounded-xl glass text-gray-400 hover:text-error transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        }
      />

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar size={14} />
        {new Date(reflection.reflection_date).toLocaleDateString('en-US', { dateStyle: 'full' })}
      </div>

      {/* Content */}
      <GlassCard bordered>
        {editMode ? (
          <>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="input-field w-full min-h-48 resize-none text-base leading-relaxed"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <Button variant="glass" fullWidth onClick={() => { setEditMode(false); setText(reflection.reflection_text); }}>Cancel</Button>
              <Button variant="primary" fullWidth loading={saving} onClick={handleSave}>Save Changes</Button>
            </div>
          </>
        ) : (
          <p className="text-base text-white leading-relaxed whitespace-pre-wrap">{text || reflection.reflection_text}</p>
        )}
      </GlassCard>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Reflection?" size="sm">
        <p className="text-sm text-gray-400 mb-6">This action cannot be undone. Your reflection will be permanently deleted.</p>
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" fullWidth loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

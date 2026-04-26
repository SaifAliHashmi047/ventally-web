import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../locales/i18n';
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
        title={t('VenterHome.reflectionDetailTitle')}
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
              className="p-2 rounded-xl glass text-white/50 hover:text-white transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        }
      />

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-white/80">
        <Calendar size={14} />
        {new Date(reflection.reflection_date).toLocaleDateString(i18n.language, { dateStyle: 'full' })}
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
              <Button variant="glass" fullWidth onClick={() => { setEditMode(false); setText(reflection.reflection_text); }}>{t('Common.cancel')}</Button>
              <Button variant="primary" fullWidth loading={saving} onClick={handleSave}>{t('VenterHome.saveReflection')}</Button>
            </div>
          </>
        ) : (
          <p className="text-base text-white leading-relaxed whitespace-pre-wrap">{text || reflection.reflection_text}</p>
        )}
      </GlassCard>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title={t('VenterHome.deleteReflection')} size="sm">
        <p className="text-sm text-gray-400 mb-6">{t('VenterHome.deleteReflectionDescription')}</p>
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => setDeleteModal(false)}>{t('Common.cancel')}</Button>
          <Button variant="danger" fullWidth loading={deleting} onClick={handleDelete}>{t('Common.delete')}</Button>
        </div>
      </Modal>
    </div>
  );
};

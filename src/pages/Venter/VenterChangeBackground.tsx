import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  setSelectedBackgroundId,
  addCustomBackground,
  removeCustomBackground,
} from '../../store/slices/appSlice';
import type { RootState } from '../../store/store';
import {
  defaultBackgrounds,
  getBackgroundStyle,
  getBackgroundSrc,
  type CustomBackground,
} from '../../utils/backgrounds';
import { Plus, Trash2, Check } from 'lucide-react';
import { toastSuccess } from '../../utils/toast';

export const VenterChangeBackground = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customBackgrounds: CustomBackground[] = useSelector(
    (state: RootState) => (state.app as any)?.customBackgrounds ?? []
  );
  const selectedBackgroundId: string = useSelector(
    (state: RootState) => (state.app as any)?.selectedBackgroundId ?? '1'
  );

  // Local preview — only committed to Redux when user taps "Set as Current"
  const [previewId, setPreviewId] = useState<string>(selectedBackgroundId);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Merge defaults + custom into one list
  const allBackgrounds = [
    ...defaultBackgrounds,
    ...customBackgrounds.map(bg => ({
      id: bg.id,
      name: bg.name,
      image: bg.uri,   // base64 data URI
      isDefault: false as const,
    })),
  ];

  const isCurrentActive = previewId === selectedBackgroundId;

  // ── Set as current ──────────────────────────────────────────────────────────
  const handleSetAsCurrent = () => {
    dispatch(setSelectedBackgroundId(previewId));
    toastSuccess(t('QuietHours.addedTitle'));
  };

  // ── Upload custom background → convert to base64 for persistence ────────────
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = ev => {
        const base64 = ev.target?.result as string;
        if (!base64) return;
        const newBg: CustomBackground = {
          id: `custom-${Date.now()}`,
          uri: base64,
          name: file.name.replace(/\.[^.]+$/, '') || `Background ${customBackgrounds.length + 1}`,
        };
        dispatch(addCustomBackground(newBg));
        setPreviewId(newBg.id);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [customBackgrounds.length, dispatch]
  );

  // ── Delete custom background ────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    dispatch(removeCustomBackground(pendingDeleteId));
    if (selectedBackgroundId === pendingDeleteId) dispatch(setSelectedBackgroundId('1'));
    if (previewId === pendingDeleteId) setPreviewId('1');
    setShowDeleteModal(false);
    setPendingDeleteId(null);
  };

  // Preview background style (applied to the live preview window)
  const previewStyle = getBackgroundStyle(previewId, customBackgrounds);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('GeneralSettings.changeBackground')}
        onBack={() => navigate(-1)}
      />

      {/* ── Live Preview ──────────────────────────────────────────────────── */}
      <div className="mb-5 rounded-3xl overflow-hidden border border-white/10 shadow-xl">
        {/* Full-bleed preview image */}
        <div
          className="w-full h-44 relative transition-all duration-500"
          style={{ ...previewStyle, backgroundAttachment: 'local' }}
        >
          {/* Dark overlay so badge text is readable */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              {isCurrentActive
                ? t('ChangeBackground.current')
                : allBackgrounds.find(b => b.id === previewId)?.name ?? ''}
            </span>
          </div>
        </div>

        {/* Description strip */}
        <div className="glass px-4 py-3">
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('ChangeBackground.description')}
          </p>
        </div>
      </div>

      {/* ── Background Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
        {allBackgrounds.map(bg => {
          const isSelected = bg.id === previewId;
          const isCurrent = bg.id === selectedBackgroundId;
          const src = getBackgroundSrc(bg.id, customBackgrounds);

          return (
            <div key={bg.id} className="relative group">
              <button
                onClick={() => setPreviewId(bg.id)}
                className={`w-full h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 block ${
                  isSelected
                    ? 'border-accent scale-105 shadow-lg shadow-accent/30'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Actual background image thumbnail */}
                <img
                  src={src}
                  alt={bg.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Selected checkmark overlay */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-2xl">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-md">
                      <Check size={12} className="text-white" />
                    </div>
                  </div>
                )}

                {/* "Current" badge (only when not selected) */}
                {isCurrent && !isSelected && (
                  <div className="absolute bottom-1 left-1">
                    <span className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded-md leading-none">
                      {t('ChangeBackground.current')}
                    </span>
                  </div>
                )}
              </button>

              {/* Delete button — custom backgrounds only, visible on hover */}
              {!bg.isDefault && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setPendingDeleteId(bg.id);
                    setShowDeleteModal(true);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
                >
                  <Trash2 size={10} className="text-white" />
                </button>
              )}

              <p className="text-xs text-center text-gray-500 mt-1 truncate px-1">
                {bg.name}
              </p>
            </div>
          );
        })}

        {/* Add custom background tile */}
        <div>
          <label className="cursor-pointer block">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-full h-20 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-accent/50 hover:bg-white/3 transition-all duration-200">
              <Plus size={18} className="text-gray-500" />
              <span className="text-xs text-gray-500">Add</span>
            </div>
          </label>
          <p className="text-xs text-center text-gray-600 mt-1">Custom</p>
        </div>
      </div>

      {/* ── Action Button ─────────────────────────────────────────────────── */}
      {isCurrentActive ? (
        <div className="flex items-center justify-center gap-2 py-3 glass rounded-2xl">
          <Check size={16} className="text-success" />
          <span className="text-sm font-medium text-success">
            {t('ChangeBackground.current')}
          </span>
        </div>
      ) : (
        <Button variant="primary" size="lg" fullWidth onClick={handleSetAsCurrent}>
          {t('ChangeBackground.setAsCurrent')}
        </Button>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setPendingDeleteId(null); }}
        title={t('ChangeBackground.deleteAlertTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-400 mb-5">
          {t('ChangeBackground.deleteAlertMessage')}
        </p>
        <div className="flex gap-3">
          <Button
            variant="glass"
            fullWidth
            onClick={() => { setShowDeleteModal(false); setPendingDeleteId(null); }}
          >
            {t('ChangeBackground.cancel')}
          </Button>
          <Button variant="danger" fullWidth onClick={handleDeleteConfirm}>
            {t('ChangeBackground.delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

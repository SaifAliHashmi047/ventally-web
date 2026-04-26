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
  getBackgroundSrc,
  type CustomBackground,
} from '../../utils/backgrounds';
import { Plus, Trash2 } from 'lucide-react';
import { toastSuccess } from '../../utils/toast';

export const VenterChangeBackground = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const customBackgrounds: CustomBackground[] = useSelector(
    (state: RootState) => (state.app as any)?.customBackgrounds ?? []
  );
  const selectedBackgroundId: string = useSelector(
    (state: RootState) => (state.app as any)?.selectedBackgroundId ?? '1'
  );

  const [previewId, setPreviewId] = useState<string>(selectedBackgroundId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const allBackgrounds = [
    ...defaultBackgrounds,
    ...customBackgrounds.map(bg => ({
      id: bg.id,
      name: bg.name,
      image: bg.uri,
      isDefault: false as const,
    })),
  ];

  const isCurrentActive = previewId === selectedBackgroundId;

  const handleSetAsCurrent = () => {
    dispatch(setSelectedBackgroundId(previewId));
    toastSuccess(t('ChangeBackground.setAsCurrent'));
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = el.scrollWidth / allBackgrounds.length;
    const idx = Math.round(el.scrollLeft / cardWidth);
    const bg = allBackgrounds[idx];
    if (bg) {
      setCurrentIndex(idx);
      setPreviewId(bg.id);
    }
  };

  const scrollToIndex = (idx: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = el.scrollWidth / allBackgrounds.length;
    el.scrollTo({ left: cardWidth * idx, behavior: 'smooth' });
    setCurrentIndex(idx);
    setPreviewId(allBackgrounds[idx].id);
  };

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
        const newIndex = allBackgrounds.length;
        setPreviewId(newBg.id);
        setCurrentIndex(newIndex);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [customBackgrounds.length, dispatch, allBackgrounds.length]
  );

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    dispatch(removeCustomBackground(pendingDeleteId));
    if (selectedBackgroundId === pendingDeleteId) dispatch(setSelectedBackgroundId('1'));
    if (previewId === pendingDeleteId) { setPreviewId('1'); setCurrentIndex(0); }
    setShowDeleteModal(false);
    setPendingDeleteId(null);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('GeneralSettings.changeBackground')} onBack={() => navigate(-1)} />

      <GlassCard className="p-5 mb-5" rounded="3xl">

        {/* Status / action label */}
        <div className="flex justify-center mb-4">
          {isCurrentActive ? (
            <span className="text-sm text-white font-medium">
              {t('ChangeBackground.current', 'Current')}
            </span>
          ) : (
            <button
              onClick={handleSetAsCurrent}
              className="px-5 py-1.5 rounded-full border border-white/40 bg-white/10 text-sm text-white font-medium hover:bg-white/20 transition-all"
            >
              {t('ChangeBackground.setAsCurrent', 'Set as Current')}
            </button>
          )}
        </div>

        {/* Horizontal carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1"
          style={{ scrollBehavior: 'smooth' }}
        >
          {allBackgrounds.map((bg, idx) => {
            const isSelected = bg.id === previewId;
            const src = getBackgroundSrc(bg.id, customBackgrounds);
            return (
              <div
                key={bg.id}
                className="relative flex-shrink-0 snap-center"
                style={{ width: 'calc(100% / 2.5)' }}
              >
                <button
                  onClick={() => scrollToIndex(idx)}
                  className="w-full block"
                  style={{ height: '220px' }}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover rounded-2xl transition-all duration-300"
                    style={{
                      border: isSelected ? '2px solid white' : '2px solid transparent',
                    }}
                    loading="lazy"
                  />
                </button>

                {/* Delete button for custom backgrounds */}
                {!bg.isDefault && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setPendingDeleteId(bg.id);
                      setShowDeleteModal(true);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center z-10"
                    style={{ background: 'rgba(255,0,0,0.6)' }}
                  >
                    <Trash2 size={13} className="text-white" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {allBackgrounds.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className="rounded-full transition-all duration-200"
              style={{
                width: currentIndex === idx ? 7 : 5,
                height: currentIndex === idx ? 7 : 5,
                background: currentIndex === idx ? 'white' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>

        {/* Add background */}
        <div className="mt-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="glass"
            fullWidth
            leftIcon={<Plus size={16} />}
            onClick={() => fileInputRef.current?.click()}
          >
            {t('ChangeBackground.addLabel', 'Add Background')}
          </Button>
        </div>
      </GlassCard>

      {/* Description */}
      <GlassCard bordered className="px-5 py-4" rounded="2xl">
        <p className="text-sm font-bold text-white mb-1">
          {t('GeneralSettings.changeBackground')}
        </p>
        <p className="text-sm text-white/80 leading-relaxed">
          {t('ChangeBackground.description')}
        </p>
      </GlassCard>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setPendingDeleteId(null); }}
        title={t('ChangeBackground.deleteAlertTitle')}
        size="sm"
      >
        <p className="text-sm text-white/80 mb-5">
          {t('ChangeBackground.deleteAlertMessage')}
        </p>
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => { setShowDeleteModal(false); setPendingDeleteId(null); }}>
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

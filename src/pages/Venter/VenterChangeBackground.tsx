import { useState } from 'react';
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
import { Image as ImageIcon, Plus, Trash2, CheckCircle } from 'lucide-react';

const DEFAULT_BACKGROUNDS = [
  { id: '1', name: 'Cosmic Dreams', color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
  { id: '2', name: 'Aurora', color: 'linear-gradient(135deg, #0d1117 0%, #1a2744 40%, #0d4f3c 100%)' },
  { id: '3', name: 'Dusk Rose', color: 'linear-gradient(135deg, #1a0a1c 0%, #3d1152 50%, #1a0a1c 100%)' },
  { id: '4', name: 'Ocean Depth', color: 'linear-gradient(135deg, #0a0e27 0%, #0d2137 50%, #0a1628 100%)' },
  { id: '5', name: 'Ember', color: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #1a0500 100%)' },
  { id: '6', name: 'Slate', color: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)' },
];

export const VenterChangeBackground = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customBackgrounds = useSelector((state: RootState) => state.app?.customBackgrounds || []);
  const selectedBackgroundId = useSelector((state: RootState) => state.app?.selectedBackgroundId || '1');
  const [newSelected, setNewSelected] = useState(selectedBackgroundId);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const allBackgrounds = [
    ...DEFAULT_BACKGROUNDS,
    ...customBackgrounds.map((bg: any) => ({
      id: bg.id,
      name: bg.name || 'Custom',
      color: '',
      uri: bg.uri,
      isCustom: true,
    })),
  ];

  const handleSet = () => {
    dispatch(setSelectedBackgroundId(newSelected));
  };

  const handleDeleteConfirm = () => {
    if (pendingDelete) {
      dispatch(removeCustomBackground(pendingDelete));
      if (selectedBackgroundId === pendingDelete || newSelected === pendingDelete) {
        setNewSelected('1');
        dispatch(setSelectedBackgroundId('1'));
      }
    }
    setShowDeleteModal(false);
    setPendingDelete(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uri = URL.createObjectURL(file);
    const newBg = {
      id: `custom-${Date.now()}`,
      uri,
      name: file.name || `Background ${customBackgrounds.length + 1}`,
    };
    dispatch(addCustomBackground(newBg));
    setNewSelected(newBg.id);
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('GeneralSettings.changeBackground', 'Change Background')} onBack={() => navigate(-1)} />

      {/* Preview + grid */}
      <GlassCard bordered className="mb-4">
        <p className="text-xs text-gray-400 mb-3">{t('ChangeBackground.description', 'Easily refresh your interface appearance by changing the background.')}</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {allBackgrounds.map(bg => {
            const isSelected = bg.id === newSelected;
            const isCurrent = bg.id === selectedBackgroundId;
            return (
              <div
                key={bg.id}
                className="relative cursor-pointer"
                onClick={() => setNewSelected(bg.id)}
              >
                <div
                  className={`h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    isSelected ? 'border-accent shadow-lg shadow-accent/20' : 'border-white/10'
                  }`}
                  style={{
                    background: (bg as any).uri ? undefined : bg.color,
                  }}
                >
                  {(bg as any).uri && (
                    <img
                      src={(bg as any).uri}
                      alt={bg.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isCurrent && (
                    <div className="absolute bottom-1 left-1">
                      <span className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded-md">
                        {t('ChangeBackground.current', 'Current')}
                      </span>
                    </div>
                  )}
                  {(bg as any).isCustom && (
                    <button
                      className="absolute top-1 right-1 bg-red-600/70 rounded-md p-0.5"
                      onClick={e => {
                        e.stopPropagation();
                        setPendingDelete(bg.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={10} className="text-white" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-center text-gray-400 mt-1 truncate">{bg.name}</p>
              </div>
            );
          })}

          {/* Add custom button */}
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <div className="h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-accent/50 transition-colors">
              <Plus size={18} className="text-gray-500" />
              <span className="text-xs text-gray-500">Add</span>
            </div>
          </label>
        </div>

        {newSelected !== selectedBackgroundId ? (
          <Button variant="primary" fullWidth onClick={handleSet}>
            {t('ChangeBackground.setAsCurrent', 'Set as Current')}
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-success">
            <CheckCircle size={16} />
            <span className="text-sm">{t('ChangeBackground.current', 'Current background active')}</span>
          </div>
        )}
      </GlassCard>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('ChangeBackground.deleteAlertTitle', 'Delete Background')}
        size="sm"
      >
        <p className="text-sm text-gray-400 mb-5">
          {t('ChangeBackground.deleteAlertMessage', 'Are you sure you want to delete this background?')}
        </p>
        <div className="flex gap-3">
          <Button variant="glass" fullWidth onClick={() => setShowDeleteModal(false)}>
            {t('ChangeBackground.cancel', 'Cancel')}
          </Button>
          <Button variant="danger" fullWidth onClick={handleDeleteConfirm}>
            {t('ChangeBackground.delete', 'Delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

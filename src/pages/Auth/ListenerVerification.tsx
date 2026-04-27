import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, UploadCloud, File, Image as ImageIcon } from 'lucide-react';
import { toastError } from '../../utils/toast';
import { setUser, setIsVenter } from '../../store/slices/userSlice';
import { useRoles } from '../../api/hooks/useRoles';
import { useListenerVerification } from '../../api/hooks/useListenerVerification';
import { setTokens } from '../../api/apiInstance';
import type { RootState } from '../../store/store';

export const ListenerVerification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { updateAvailableRoles, switchRole } = useRoles();
  const { submitVerification } = useListenerVerification();

  const { isAccountChanging } = useAccountChangeFlow();
  const legacyAccountTypeChanging = (location.state as any)?.accountTypeChanging;
  const accountTypeChanging = isAccountChanging || legacyAccountTypeChanging;
  const user = useSelector((state: RootState) => state.user.user as any);

  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<File | null>(null);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const infoItems = [
    t('ListenerVerification.info1'),
    t('ListenerVerification.info2'),
    t('ListenerVerification.info3'),
    t('ListenerVerification.info4'),
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocument(e.target.files[0]);
    }
    setShowPickerModal(false);
  };

  const triggerFileInput = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (!document) {
      toastError(t('Common.pleaseUploadDocument'));
      return;
    }

    setLoading(true);
    try {
      if (accountTypeChanging) {
        // ── accountTypeChanging flow — matches RN exactly ──────────────────
        // Step 1: Add listener role to available roles
        const rolesRes = await updateAvailableRoles({
          rolesToAdd: ['listener'],
          rolesToRemove: [],
        });

        if (rolesRes) {
          // Step 2: Switch active role to listener
          const switchRes = await switchRole({ targetRole: 'listener' });

          if (switchRes?.tokens) {
            await setTokens(switchRes.tokens.accessToken, switchRes.tokens.refreshToken);

            if (switchRes.user) {
              const updatedUser = {
                ...switchRes.user,
                role: switchRes.user.activeRole?.toLowerCase() || 'listener',
              };
              dispatch(setUser(updatedUser as Parameters<typeof setUser>[0]));
              dispatch(setIsVenter(false));
            }
          }

          // Step 3: Submit verification document AFTER role is set
          await submitVerification(document);
        }

        // Navigate to listener home — same as RN (navigation.replace(routes.listenerHomeTab))
        window.location.replace('/listener/home');

      } else {
        // ── Normal signup flow ─────────────────────────────────────────────
        await submitVerification(document);

        // Update Redux to reflect pending status
        if (user) {
          dispatch(setUser({
            ...user,
            verificationDocumentStatus: 'pending',
          } as Parameters<typeof setUser>[0]));
        }

        // Navigate to listener home — same as RN (navigation.replace(routes.listenerHomeTab))
        window.location.replace('/listener/home');
      }
    } catch (error: any) {
      const errorMsg = error?.message || error?.error || '';

      // RN special case: if already has pending verification, still navigate to home
      if (typeof errorMsg === 'string' && errorMsg.includes('pending verification document')) {
        window.location.replace('/listener/home');
        return;
      }

      toastError(errorMsg || t('Common.failed'));
    } finally {
      setLoading(false);
    }
  };

  const verificationContent = (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 pb-2"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <GlassCard className="p-8 pb-10 w-full" rounded="3xl">
        <h1 className="text-[22px] font-medium text-white text-center mb-3">
          {t('ListenerVerification.title')}
        </h1>
        <p className="text-[15px] text-white/80 text-center mb-6 leading-relaxed px-4">
          {t('ListenerVerification.description')}
        </p>

        <div className="mb-8">
          <h2 className="text-[17px] font-medium text-white mb-2">
            {t('ListenerVerification.uploadTitle')}
          </h2>
          <p className="text-[14px] text-white/60 mb-6">
            {t('ListenerVerification.uploadSubtitle')}
          </p>

          <Button
            variant="glass"
            onClick={() => setShowPickerModal(true)}
            leftIcon={<UploadCloud size={20} />}
            fullWidth
            disabled={loading}
          >
            {t('ListenerVerification.uploadButton')}
          </Button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {document && (
            <div className="mt-4 p-4 bg-white/10 rounded-xl flex items-center justify-between">
              <span className="text-sm font-medium text-white truncate flex-1 mr-3">
                {document.name}
              </span>
              <button
                onClick={() => setDocument(null)}
                className="text-white/60 hover:text-white text-sm flex-shrink-0"
              >
                {t('Common.cancel')}
              </button>
            </div>
          )}
        </div>

        {/* Info bullets */}
        <div className="w-full flex flex-col gap-2 mb-8">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white mr-3 mt-2 flex-shrink-0" />
              <span className="text-sm text-white/90 flex-1 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          loading={loading}
        >
          {t('ListenerVerification.submit')}
        </Button>

        <p className="text-xs leading-relaxed text-white/60 mt-6 text-center px-4">
          {t('ListenerVerification.footertext')}
        </p>
      </GlassCard>

      {/* Upload Source Modal */}
      {showPickerModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/60 p-4 animate-fade-in pb-8">
          <GlassCard className="w-full max-w-[400px] p-2 flex flex-col items-center" rounded="3xl">
            <h3 className="text-sm font-semibold text-white/60 my-4 text-center w-full border-b border-white/10 pb-4">
              {t('ListenerVerification.selectSource')}
            </h3>

            <button
              className="w-full flex items-center gap-4 py-4 px-6 hover:bg-white/5 transition-colors border-b border-white/10"
              onClick={() => triggerFileInput('image/*')}
            >
              <ImageIcon size={20} className="text-white/80" />
              <span className="text-base font-medium text-white">
                {t('ListenerVerification.pickImage')}
              </span>
            </button>

            <button
              className="w-full flex items-center gap-4 py-4 px-6 hover:bg-white/5 transition-colors"
              onClick={() => triggerFileInput('application/pdf')}
            >
              <File size={20} className="text-white" />
              <span className="text-base font-medium text-white">
                {t('ListenerVerification.pickDocument')}
              </span>
            </button>

            <div className="w-full px-4 py-3 mt-2">
              <button
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-medium transition-all"
                onClick={() => setShowPickerModal(false)}
              >
                {t('Common.cancel')}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );

  if (accountTypeChanging) {
    return <div className="page-wrapper page-wrapper--wide animate-fade-in">{verificationContent}</div>;
  }
  return <AuthLayout>{verificationContent}</AuthLayout>;
};

import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, UploadCloud, File, Image as ImageIcon } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastError } from '../../utils/toast';
import { setUser, setIsVenter } from '../../store/slices/userSlice';
import { useRoles } from '../../api/hooks/useRoles';
import { setTokens } from '../../api/apiInstance';

export const ListenerVerification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { updateAvailableRoles, switchRole } = useRoles();
  
  const accountTypeChanging = (location.state as any)?.accountTypeChanging;
  
  const user = useSelector((state: any) => state.user.user);
  
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<File | null>(null);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const infoItems = [
    t('ListenerVerification.info1', 'Must be a valid government-issued ID.'),
    t('ListenerVerification.info2', 'Ensure the image is clear and text is readable.'),
    t('ListenerVerification.info3', 'All four corners should be visible.'),
    t('ListenerVerification.info4', 'No glare or shadows covering information.'),
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
      toastError(t("Common.pleaseUploadDocument", "Please upload a document before proceeding"));
      return;
    }

    setLoading(true);
    try {
      // 1. Fire off the Document Form Data
      const formData = new FormData();
      formData.append('document', document);

      await apiInstance.post('listener-verifications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (accountTypeChanging) {
        const response = await updateAvailableRoles({
          rolesToAdd: ['listener'],
          rolesToRemove: [],
        });

        if (response) {
          // Silent switch to listener role
          const switchRes = await switchRole({ targetRole: 'listener' });

          if (switchRes && switchRes.tokens) {
            await setTokens(switchRes.tokens.accessToken, switchRes.tokens.refreshToken);

            // Update Redux state silently
            if (switchRes.user) {
              const reduxUser = {
                ...switchRes.user,
                role: switchRes.user.activeRole?.toLowerCase() || 'listener',
                verificationStatus: 'pending'
              };
              dispatch(setUser(reduxUser as any));
              dispatch(setIsVenter(false));
            }
          }
        }
      } else if (user) {
        // Update Redux state so the UI knows they are pending (Normal Signup Flow)
        const updatedUser = {
          ...user,
          role: 'listener',
          verificationStatus: 'pending'
        };
        dispatch(setUser(updatedUser));
      }

      // 2. Navigate straight to VerificationInProgress
      navigate('/signup/verification-in-progress', { replace: true });

    } catch (error: any) {
      toastError(error?.message || error?.error || t('Common.failed', 'Failed to submit verification'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 pb-2"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <GlassCard className="p-8 pb-10 w-full" rounded="3xl">
        <h1 className="text-[22px] font-medium text-white text-center mb-3">
          {t('ListenerVerification.title', 'Identity Verification')}
        </h1>
        <p className="text-[15px] text-white/80 text-center mb-6 leading-relaxed px-4">
          {t('ListenerVerification.description', 'Please verify your identity so we can approve your Listener dashboard application.')}
        </p>

        <div className="mb-8">
          <h2 className="text-[17px] font-medium text-white mb-2">
            {t('ListenerVerification.uploadTitle', 'Upload Document')}
          </h2>
          <p className="text-[14px] text-white/60 mb-6">
            {t('ListenerVerification.uploadSubtitle', 'Upload a photo or scanned copy of your primary Government ID.')}
          </p>

          <Button
            variant="glass-bordered"
            onClick={() => setShowPickerModal(true)}
            leftIcon={<UploadCloud size={20} />}
            fullWidth
            disabled={loading}
          >
            {t('ListenerVerification.uploadButton', 'Upload File')}
          </Button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {document && (
            <div className="mt-4 p-4 bg-white/10 rounded-[12px] flex items-center justify-between">
              <span className="text-[15px] font-medium text-white truncate w-5/6">
                {document.name}
              </span>
              <button onClick={() => setDocument(null)} className="text-white/60 hover:text-white text-sm">
                 {t('Common.remove', 'Remove')}
              </button>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-2 mb-8">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white mr-3 mt-2 flex-shrink-0" />
              <span className="text-[15px] text-white/90 flex-1 leading-[1.4]">{item}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading || !document}
          className="btn btn-primary w-full py-4 text-[16px] font-medium transition-all disabled:opacity-50"
          style={{ height: '54px' }}
        >
          {loading ? t('Common.loading', 'Loading...') : t('ListenerVerification.submit', 'Submit Verification')}
        </button>

        <p className="text-[13px] leading-relaxed text-white/60 mt-8 text-center px-4">
          {t('ListenerVerification.footertext', 'Your data is securely encrypted. By confirming this, you agree to Ventally protecting this personal data securely.')}
        </p>
      </GlassCard>

      {/* Upload Source Modals */}
      {showPickerModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/60 p-4 animate-fade-in pb-8">
          <GlassCard className="w-full max-w-[400px] p-2 flex flex-col items-center" rounded="3xl">
            <h3 className="text-[16px] font-semibold text-white/60 my-4 text-center w-full border-b border-white/10 pb-4">
              {t('ListenerVerification.selectSource', 'Select Document Source')}
            </h3>

            <button 
              className="w-full flex items-center gap-4 py-4 px-6 hover:bg-white/5 transition-colors border-b border-white/10"
              onClick={() => triggerFileInput('image/*')}
            >
              <ImageIcon size={20} className="text-white/80" />
              <span className="text-[17px] font-medium text-white">
                {t('ListenerVerification.pickImage', 'Upload an Image')}
              </span>
            </button>

            <button 
              className="w-full flex items-center gap-4 py-4 px-6 hover:bg-white/5 transition-colors"
              onClick={() => triggerFileInput('application/pdf')}
            >
              <File size={20} className="text-white/80" />
              <span className="text-[17px] font-medium text-white">
                {t('ListenerVerification.pickDocument', 'Upload a PDF Document')}
              </span>
            </button>

            <div className="w-full px-4 py-3 mt-2">
               <button 
                  className="w-full py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-medium transition-all"
                  onClick={() => setShowPickerModal(false)}
               >
                 {t('Common.cancel', 'Cancel')}
               </button>
            </div>
          </GlassCard>
        </div>
      )}
    </AuthLayout>
  );
};

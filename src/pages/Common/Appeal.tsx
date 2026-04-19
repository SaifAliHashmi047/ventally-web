import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Upload, X } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastError, toastSuccess } from '../../utils/toast';

export const Appeal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [reportId, setReportId] = useState('');
  const [summary, setSummary] = useState('');
  const [pickedFile, setPickedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPickedFile(file);
  };

  const handleSubmit = async () => {
    if (!emailOrPhone.trim()) {
      toastError(t('Common.emailRequired'));
      return;
    }
    if (!summary.trim()) {
      toastError(t('Common.summaryRequired'));
      return;
    }
    if (!pickedFile) {
      toastError(t('Common.pleaseUploadDocument'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+\d\s\-()]{7,}$/;
    if (!emailRegex.test(emailOrPhone.trim()) && !phoneRegex.test(emailOrPhone.trim())) {
      toastError(t('Common.invalidEmail'));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('contact', emailOrPhone.trim());
      formData.append('reportId', reportId.trim());
      formData.append('summary', summary.trim());
      formData.append('document', pickedFile);

      await apiInstance.post('support/appeal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toastSuccess(t('Common.operationSuccess'));
      setTimeout(() => navigate(-1), 1500);
    } catch (error: any) {
      toastError(error?.error || t('Common.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Appeal.title')} onBack={() => navigate(-1)} />

      {/* Subtitle */}
      <p className="text-sm text-gray-400 text-center mb-6">{t('Appeal.subtitle')}</p>

      <GlassCard bordered>
        <div className="space-y-4">
          {/* Email or Phone */}
          <Input
            label={t('Appeal.emailOrPhone')}
            value={emailOrPhone}
            onChange={e => setEmailOrPhone(e.target.value)}
            placeholder={t('Appeal.emailOrPhone')}
          />

          {/* Report ID */}
          <Input
            label={t('Appeal.reportId')}
            value={reportId}
            onChange={e => setReportId(e.target.value)}
            placeholder={t('Appeal.reportId')}
          />

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              {t('Appeal.summary')}
            </label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder={t('Appeal.summaryPlaceholder')}
              className="input-field w-full h-28 resize-none"
            />
          </div>

          {/* Upload Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              {t('Appeal.letterUpload')}
            </label>
            <div
              className="glass rounded-2xl border border-dashed border-white/25 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center mb-3">
                <Upload size={18} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-400 text-center whitespace-pre-line">
                {t('Appeal.uploadHint')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Picked file */}
            {pickedFile && (
              <div className="flex items-center justify-between mt-2 glass rounded-xl px-3 py-2">
                <span className="text-sm text-white truncate flex-1 mr-2">{pickedFile.name}</span>
                <button
                  onClick={() => setPickedFile(null)}
                  className="w-6 h-6 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white flex-shrink-0"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        {t('Appeal.submit')}
      </Button>
    </div>
  );
};

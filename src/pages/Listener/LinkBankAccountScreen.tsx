import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lock } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastSuccess, toastError } from '../../utils/toast';

export const LinkBankAccountScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ accountName: '', routingNumber: '', accountNumber: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiInstance.post('payments/payout-methods/add', form);
      toastSuccess(t('Common.operationSuccess'));
      navigate(-1);
    } catch (e: any) {
      toastError(e?.error || t('Common.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader 
        title={t('PayoutMethods.addBankAccount', 'Link Bank Account')} 
        onBack={() => navigate(-1)} 
      />

      <div className="space-y-4 pt-4 mb-8">
        <Input 
          label={t('PayoutMethods.accountName', 'Account Name')} 
          placeholder={t('PayoutMethods.accountNamePlaceholder', 'John Doe')} 
          value={form.accountName} 
          onChange={e => setForm(p => ({ ...p, accountName: e.target.value }))} 
        />
        <Input 
          label={t('PayoutMethods.routingNumber', 'Routing Number')} 
          placeholder="000000000" 
          value={form.routingNumber} 
          onChange={e => setForm(p => ({ ...p, routingNumber: e.target.value }))} 
        />
        <Input 
          label={t('PayoutMethods.accountNumber', 'Account Number')} 
          placeholder="000000000000" 
          value={form.accountNumber} 
          onChange={e => setForm(p => ({ ...p, accountNumber: e.target.value }))} 
        />
      </div>

      <div className="flex items-center gap-2 justify-center text-xs text-gray-500 mb-6 mt-4">
        <Lock size={12} />
        <span>{t('Payment.sslEncrypted', 'Payments are SSL encrypted and secure')}</span>
      </div>

      <Button 
        variant="primary" 
        fullWidth 
        disabled={!form.accountName || !form.routingNumber || !form.accountNumber}
        loading={loading}
        onClick={handleSave}
      >
        {t('Common.save', 'Save')}
      </Button>
    </div>
  );
};

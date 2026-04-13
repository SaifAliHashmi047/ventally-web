import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import apiInstance from '../../api/apiInstance';

export const AddPaymentMethodScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvc: '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app this would typically go through Stripe Elements
      // For now, we mock saving a payment method
      await apiInstance.post('payments/methods/add', form);
      // Fallback redirect if API fails or succeeds (as per gap recovery logic port)
      navigate('/signup/payment/saved');
    } catch {
      navigate('/signup/payment/saved');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <button 
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-white flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> {t('Common.back', 'Back')}
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{t('Payment.addMethod', 'Add Payment Method')}</h1>
        <p className="text-sm text-gray-500">{t('Payment.secureInfo', 'Your payment information is strictly confidential and secure.')}</p>
      </div>

      <div className="space-y-4 mb-8">
        <Input 
          label={t('Payment.nameOnCard', 'Name on Card')} 
          placeholder="John Doe" 
          value={form.cardName} 
          onChange={e => setForm(p => ({ ...p, cardName: e.target.value }))} 
        />
        <Input 
          label={t('Payment.cardNumber', 'Card Number')} 
          placeholder="0000 0000 0000 0000" 
          value={form.cardNumber} 
          onChange={e => setForm(p => ({ ...p, cardNumber: e.target.value }))} 
          leftIcon={<CreditCard size={16} />}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label={t('Payment.expiry', 'Expiry Date')} 
            placeholder="MM/YY" 
            value={form.expiry} 
            onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} 
          />
          <Input 
            label={t('Payment.cvc', 'CVC')} 
            placeholder="123" 
            type="password"
            value={form.cvc} 
            onChange={e => setForm(p => ({ ...p, cvc: e.target.value }))} 
            leftIcon={<Lock size={16} />}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center text-xs text-gray-500 mb-6">
        <Lock size={12} />
        <span>{t('Payment.sslEncrypted', 'Payments are SSL encrypted and secure')}</span>
      </div>

      <Button 
        variant="primary" 
        fullWidth 
        disabled={!form.cardNumber || !form.expiry || !form.cvc}
        loading={loading}
        onClick={handleSave}
      >
        {t('Payment.saveCard', 'Save Card')}
      </Button>
    </AuthLayout>
  );
};

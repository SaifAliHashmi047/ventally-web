import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { ArrowLeft, CreditCard, Plus, ChevronRight } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';

export const PaymentMethodsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAccountChanging, resolve } = useAccountChangeFlow();
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiInstance.get('payments/methods')
      .then(res => setMethods(res.data?.methods || []))
      .catch(() => setMethods([]))
      .finally(() => setLoading(false));
  }, []);

  const content = (
    <>
      <button
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-white flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> {t('Common.back', 'Back')}
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{t('Payment.paymentMethods', 'Payment Methods')}</h1>
        <p className="text-sm text-gray-500">{t('Payment.manageMethods', 'Manage your payment methods')}</p>
      </div>

      <div className="space-y-3 mb-8">
        {loading ? (
          <div className="skeleton h-20 rounded-2xl w-full" />
        ) : methods.length > 0 ? (
          methods.map((method, idx) => (
            <GlassCard key={idx} hover className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-white font-semibold">•••• {method.last4}</p>
                  <p className="text-xs text-gray-400 uppercase">{method.brand} - {t('Payment.expires', 'Expires')} {method.expMonth}/{method.expYear}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-500" />
            </GlassCard>
          ))
        ) : (
          <GlassCard className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/20">
            <CreditCard size={32} className="text-gray-500 mb-3" />
            <p className="text-sm text-gray-400">{t('Payment.noMethods', 'No payment methods added yet.')}</p>
          </GlassCard>
        )}
      </div>

      <Button
        variant="glass"
        fullWidth
        leftIcon={<Plus size={16} />}
        onClick={() => navigate(resolve('payment/add'))}
      >
        {t('Payment.addNewMethod', 'Add New Payment Method')}
      </Button>

      {methods.length > 0 && (
        <div className="mt-6">
          <Button variant="primary" fullWidth onClick={() => navigate(resolve('success'))}>
            {t('Common.continue', 'Continue')}
          </Button>
        </div>
      )}
    </>
  );

  if (isAccountChanging) {
    return <div className="page-wrapper page-wrapper--wide animate-fade-in">{content}</div>;
  }
  return <AuthLayout>{content}</AuthLayout>;
};

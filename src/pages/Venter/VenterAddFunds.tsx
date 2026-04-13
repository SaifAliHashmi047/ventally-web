import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useWallet } from '../../api/hooks/useWallet';
import { DollarSign, CreditCard } from 'lucide-react';

const PRESET_AMOUNTS = [5, 10, 20, 50, 100];

export const VenterAddFunds = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addFunds } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddFunds = async () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val < 1) {
      setError('Please enter a valid amount (min. $1)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await addFunds(val);
      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        navigate('/venter/wallet');
      }
    } catch (e: any) {
      setError(e?.error || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Wallet.addFunds')} onBack={() => navigate('/venter/wallet')} />

      <GlassCard bordered>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3">
            <DollarSign size={28} className="text-primary" />
          </div>
          <p className="text-sm text-gray-500">{t('Wallet.selectAmount')}</p>
        </div>

        {/* Preset Amounts */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {PRESET_AMOUNTS.map(preset => (
            <button
              key={preset}
              onClick={() => setAmount(String(preset))}
              className={`py-3 rounded-2xl text-sm font-semibold transition-all ${
                amount === String(preset)
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'glass text-gray-400 hover:bg-white/6'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <Input
          label={t('Wallet.selectAmount')}
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={e => { setAmount(e.target.value); setError(''); }}
          error={error}
          leftIcon={<DollarSign size={16} />}
        />
      </GlassCard>

      {/* Summary */}
      {amount && parseFloat(amount) > 0 && (
        <GlassCard padding="sm" rounded="2xl">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount</span>
            <span className="text-white font-semibold">${parseFloat(amount).toFixed(2)}</span>
          </div>
          <div className="divider my-2" />
          <div className="flex justify-between text-base">
            <span className="text-gray-400 font-medium">Total</span>
            <span className="text-white font-bold">${parseFloat(amount).toFixed(2)}</span>
          </div>
        </GlassCard>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!amount || parseFloat(amount) < 1}
        leftIcon={<CreditCard size={18} />}
        onClick={handleAddFunds}
      >
        {t('Wallet.confirm')}
      </Button>

      <p className="text-xs text-gray-600 text-center">
        Payments are processed securely. Your card details are never stored.
      </p>
    </div>
  );
};

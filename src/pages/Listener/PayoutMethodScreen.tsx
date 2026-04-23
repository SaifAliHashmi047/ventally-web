import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Building, Check } from 'lucide-react';
import apiInstance from '../../api/apiInstance';
import { toastSuccess, toastError } from '../../utils/toast';

export const PayoutMethodScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState<'bank' | null>(null);
  const [bankConnected, setBankConnected] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [bankRes, summaryRes] = await Promise.all([
          apiInstance.get('earnings/bank-account/status'),
          apiInstance.get('earnings/summary'),
        ]);
        if (bankRes.data?.status?.payoutEnabled) {
          setSelectedMethod('bank');
          setBankConnected(true);
        }
        const s = summaryRes.data;
        setAvailableBalance(s?.availableBalance ?? s?.pendingBalance ?? 0);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  const handleContinue = () => {
    if (bankConnected) {
      setWithdrawAmount('');
      setShowWithdrawModal(true);
    } else {
      navigate('/listener/bank-account');
    }
  };

  const handleWithdrawSubmit = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toastError(t('Listener.wallet.withdrawError', 'Please enter a valid amount'));
      return;
    }
    if (amount > availableBalance) {
      toastError(t('Listener.wallet.exceedsBalance', 'Amount exceeds your available balance'));
      return;
    }
    setWithdrawLoading(true);
    try {
      await apiInstance.post('earnings/withdraw', { amount });
      toastSuccess(t('Listener.wallet.withdrawSuccess', 'Withdrawal request submitted successfully'));
      setShowWithdrawModal(false);
      setAvailableBalance(prev => prev - amount);
    } catch (e: any) {
      toastError(e?.response?.data?.error || e?.message || 'Withdrawal failed');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const amountNum = parseFloat(withdrawAmount);
  const exceedsBalance = withdrawAmount !== '' && amountNum > availableBalance;

  return (
    <div className="page-wrapper animate-fade-in flex flex-col items-center justify-center min-h-[80vh]">
      <PageHeader
        title={t('Listener.payout.title', 'Payout Method')}
        onBack={() => navigate(-1)}
      />

      <div className="w-full max-w-sm space-y-4">
        {/* Bank Account card */}
        <GlassCard
          bordered
          className={`cursor-pointer transition-all border-white/10 ${
            selectedMethod === 'bank' ? 'border-white/40' : ''
          }`}
          onClick={() => {
            if (!bankConnected) navigate('/listener/bank-account');
            else setSelectedMethod('bank');
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Building size={20} className="text-white" />
              <span className="text-sm font-semibold text-white">
                {t('Listener.payout.bankAccount', 'Bank Account')}
              </span>
            </div>
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
              selectedMethod === 'bank'
                ? 'bg-primary border-primary'
                : 'border-white/30 bg-transparent'
            }`}>
              {selectedMethod === 'bank' && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            {t('Listener.payout.bankAccountDesc', 'Transfers are sent automatically to your linked bank account. All transfers are securely processed through Stripe.')}
          </p>
          {bankConnected && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-xs text-success font-medium">Connected</span>
            </div>
          )}
        </GlassCard>

        <Button
          variant="primary"
          fullWidth
          loading={loading}
          onClick={handleContinue}
          className="h-14 rounded-full font-semibold"
        >
          {bankConnected
            ? t('Listener.wallet.withdrawEarnings', 'Withdraw Funds')
            : t('Common.continue', 'Continue')}
        </Button>

        <p className="text-xs text-white/40 text-center leading-relaxed px-4">
          {t('Listener.payout.footer', 'Transfers typically arrive within 1 to 3 business days, depending on your bank.')}
        </p>
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => !withdrawLoading && setShowWithdrawModal(false)}
        title={t('Listener.wallet.withdrawAmount', 'Withdraw Amount')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-white/60 text-center">
            {t('Listener.wallet.availableForPayout', 'Available for Payout')}:{' '}
            <span className="text-white font-bold">${availableBalance.toFixed(2)}</span>
          </p>

          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={withdrawAmount}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9.]/g, '');
              const parts = val.split('.');
              if (parts.length > 2) return;
              if (parts[1] && parts[1].length > 2) return;
              setWithdrawAmount(val);
            }}
            className="w-full h-14 rounded-2xl text-center text-xl font-semibold text-white bg-white/10 border border-white/20 outline-none focus:border-white/40 transition-colors placeholder:text-white/30"
          />

          {exceedsBalance && (
            <p className="text-xs text-error text-center">
              {t('Listener.wallet.exceedsBalance', 'Amount exceeds your available balance')}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowWithdrawModal(false)}
              disabled={withdrawLoading}
            >
              {t('Common.cancel', 'Cancel')}
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={withdrawLoading}
              disabled={!withdrawAmount || amountNum <= 0 || exceedsBalance}
              onClick={handleWithdrawSubmit}
            >
              {t('Listener.wallet.withdraw', 'Withdraw')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

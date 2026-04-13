import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { useAdmin } from '../../api/hooks/useAdmin';
import { DollarSign, Download, Calendar, User, ArrowLeft, ChevronDown } from 'lucide-react';

interface PaymentRecord {
  id: string;
  userId: string;
  userType: 'venter' | 'listener';
  amount: number;
  type: 'payment' | 'payout' | 'refund';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
}

export const AdminPaymentHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getPaymentHistory } = useAdmin();

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'payment' | 'payout'>('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPaymentHistory();
        setPayments(data?.payments || []);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => 
    filter === 'all' || p.type === filter
  );

  const handleExport = () => {
    const csvContent = [
      ['ID', 'User ID', 'Type', 'Amount', 'Status', 'Date', 'Method'].join(','),
      ...filteredPayments.map(p => [
        p.id, p.userId, p.type, p.amount, p.status, p.date, p.method
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader
        title={t('Admin.paymentHistory', 'Payment History')}
        onBack={() => navigate(-1)}
      />

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        {(['all', 'payment', 'payout'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-accent/15 text-accent border border-accent/25'
                : 'text-gray-500 hover:text-white glass'
            }`}
          >
            {t(`Admin.${f}`, f.charAt(0).toUpperCase() + f.slice(1))}
          </button>
        ))}
        <div className="flex-1" />
        <Button
          variant="glass"
          size="sm"
          leftIcon={<Download size={16} />}
          onClick={handleExport}
        >
          {t('Common.export', 'Export')}
        </Button>
      </div>

      {/* Payments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <GlassCard className="text-center py-8">
            <DollarSign size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">{t('Admin.noPayments', 'No payment records found')}</p>
          </GlassCard>
        ) : (
          filteredPayments.map((payment) => (
            <GlassCard key={payment.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    payment.type === 'payment' ? 'bg-success/15' :
                    payment.type === 'payout' ? 'bg-primary/15' :
                    'bg-warning/15'
                  }`}>
                    <DollarSign size={18} className={
                      payment.type === 'payment' ? 'text-success' :
                      payment.type === 'payout' ? 'text-primary' :
                      'text-warning'
                    } />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white capitalize">{payment.type}</span>
                      <Badge variant={
                        payment.status === 'completed' ? 'success' :
                        payment.status === 'pending' ? 'warning' :
                        'error'
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {payment.userId}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(payment.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    payment.type === 'payout' ? 'text-primary' : 'text-success'
                  }`}>
                    {payment.type === 'payout' ? '-' : '+'}${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{payment.method}</p>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

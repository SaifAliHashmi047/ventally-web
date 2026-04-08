import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import apiInstance from '../../api/apiInstance';
import { ArrowLeft } from 'lucide-react';

export const ChoosePlan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('monthly');
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response: any = await apiInstance.get('payments/subscription-plans');
      if (response.success && response.data?.plans) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedPlan) {
      navigate('/signup/payment');
    }
  };

  return (
    <AuthLayout>
      <button 
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)' }}>{t('ChoosePlan.title')}</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <button 
            onClick={() => setPlanType('monthly')}
            style={{ 
              padding: '8px 24px', 
              borderRadius: '8px', 
              border: 'none',
              background: planType === 'monthly' ? 'white' : 'transparent',
              color: planType === 'monthly' ? 'black' : 'white',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            {t('ChoosePlan.monthly')}
          </button>
          <button 
            onClick={() => setPlanType('annual')}
            style={{ 
              padding: '8px 24px', 
              borderRadius: '8px', 
              border: 'none',
              background: planType === 'annual' ? 'white' : 'transparent',
              color: planType === 'annual' ? 'black' : 'white',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            {t('ChoosePlan.annual')}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading plans...</div>
        ) : (
          plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const price = planType === 'monthly' ? plan.price_monthly : plan.annual_price;
            return (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`glass card-hover ${isSelected ? 'selected-option' : ''}`}
                style={{ 
                  padding: '20px', 
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--text-pure)' : '1px solid transparent',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{plan.name}</h3>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '20px', fontWeight: 700 }}>${price}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>/{planType === 'monthly' ? 'mo' : 'yr'}</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: '1.4' }}>{plan.description || 'Access to premium features'}</p>
              </div>
            );
          })
        )}
      </div>

      <button 
        onClick={handleContinue}
        className="btn-primary" 
        style={{ height: '56px', justifyContent: 'center', fontSize: '17px', borderRadius: '16px', width: '100%' }}
        disabled={!selectedPlan}
      >
        {t('ChoosePlan.continue')}
      </button>

      <style>{`
        .selected-option {
          background: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
    </AuthLayout>
  );
};

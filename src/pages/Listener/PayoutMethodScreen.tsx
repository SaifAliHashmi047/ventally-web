import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Building, Plus, ChevronRight } from 'lucide-react';
import apiInstance from '../../api/apiInstance';

export const PayoutMethodScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [methods, setMethods] = useState<any[]>([]);
  // We mock the payout methods fetching for now

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader 
        title={t('PayoutMethods.title', 'Payout Methods')} 
        subtitle={t('PayoutMethods.subtitle', 'Manage where you receive your earnings')}
        onBack={() => navigate(-1)} 
      />

      <div className="space-y-4 pt-4">
        {methods.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/20 mb-4">
             <Building size={32} className="text-gray-500 mb-3" />
             <p className="text-sm text-gray-400">{t('PayoutMethods.noMethods', 'No payout methods added yet.')}</p>
          </GlassCard>
        ) : (
          methods.map((cm, idx) => (
             <GlassCard key={idx} hover className="flex items-center justify-between p-4 cursor-pointer">
                // method rendering here
             </GlassCard>
          ))
        )}

        <Button 
          variant="glass" 
          fullWidth 
          leftIcon={<Plus size={16} />}
          onClick={() => navigate('/listener/bank-account')}
        >
          {t('PayoutMethods.addBank', 'Link Bank Account')}
        </Button>
      </div>
    </div>
  );
};

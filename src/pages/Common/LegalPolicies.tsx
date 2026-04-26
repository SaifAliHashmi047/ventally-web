import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { ChevronRight, FileText, Shield, Heart, Headphones, Scale, CreditCard, Users, BookOpen } from 'lucide-react';
import type { RootState } from '../../store/store';

export const LegalPolicies = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user as any);
  const isListener = user?.userType === 'listener';
  const basePath = isListener ? '/listener' : '/venter';

  // Venter sees: Terms of Use, Privacy Policy, Safety Policy, Support Guide Guidelines
  const venterDocuments = [
    {
      id: 'terms',
      label: t('Legal.termsOfUse'),
      icon: FileText,
      path: `${basePath}/legal/terms`,
    },
    {
      id: 'privacy',
      label: t('Legal.privacyPolicy'),
      icon: Shield,
      path: `${basePath}/legal/privacy`,
    },
    {
      id: 'safety',
      label: t('Legal.safetyPolicy'),
      icon: Heart,
      path: `${basePath}/legal/safety`,
    },
    {
      id: 'guidelines',
      label: t('Legal.listenerGuidelines'),
      icon: Headphones,
      path: `${basePath}/legal/guidelines`,
    },
  ];

  // Listener sees additional legal docs
  const listenerDocuments = [
    {
      id: 'terms',
      label: t('Legal.termsOfUse'),
      icon: FileText,
      path: `${basePath}/legal/terms`,
    },
    {
      id: 'privacy',
      label: t('Legal.privacyPolicy'),
      icon: Shield,
      path: `${basePath}/legal/privacy`,
    },
    {
      id: 'liability',
      label: t('Legal.liabilityWaiver'),
      icon: Scale,
      path: `${basePath}/legal/liability-waiver`,
    },
    {
      id: 'payment-terms',
      label: t('Legal.paymentTerms'),
      icon: CreditCard,
      path: `${basePath}/legal/payment-terms`,
    },
    {
      id: 'listener-agreement',
      label: t('Legal.listenerAgreement'),
      icon: Users,
      path: `${basePath}/legal/listener-agreement`,
    },
    {
      id: 'nda',
      label: t('Legal.nda'),
      icon: BookOpen,
      path: `${basePath}/legal/nda`,
    },
    {
      id: 'code-of-conduct',
      label: t('Legal.codeOfConduct'),
      icon: BookOpen,
      path: `${basePath}/legal/code-of-conduct`,
    },
    {
      id: 'safety',
      label: t('Legal.safetyPolicy'),
      icon: Heart,
      path: `${basePath}/legal/safety`,
    },
    {
      id: 'guidelines',
      label: t('Legal.listenerGuidelines'),
      icon: Headphones,
      path: `${basePath}/legal/guidelines`,
    },
  ];

  const documents = isListener ? listenerDocuments : venterDocuments;

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Legal.title')} onBack={() => navigate(-1)} />

      <GlassCard padding="none" rounded="2xl">
        {documents.map(({ id, label, icon: Icon, path }, i) => (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={`settings-item w-full flex justify-between items-center px-4 py-3 text-left ${
              i < documents.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
                <Icon size={15} />
              </div>
              <span className="text-sm font-medium text-white leading-snug">{label}</span>
            </div>
            <ChevronRight size={16} className="text-white/80 flex-shrink-0" />
          </button>
        ))}
      </GlassCard>
    </div>
  );
};

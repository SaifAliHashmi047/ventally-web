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

  const venterDocuments = [
    {
      id: 'terms',
      label: t('Legal.termsOfUse', 'Terms of Use'),
      icon: FileText,
      url: '/legal/terms',
    },
    {
      id: 'privacy',
      label: t('Legal.privacyPolicy', 'Privacy Policy'),
      icon: Shield,
      url: '/legal/privacy',
    },
    {
      id: 'safety',
      label: t('Legal.safetyPolicy', 'Safety Policy'),
      icon: Heart,
      url: '/legal/safety',
    },
    {
      id: 'guidelines',
      label: t('Legal.listenerGuidelines', 'Support Guide Guidelines'),
      icon: Headphones,
      url: '/legal/listener-guidelines',
    },
  ];

  const listenerDocuments = [
    {
      id: 'terms',
      label: t('Legal.termsOfUse', 'Terms of Use'),
      icon: FileText,
      url: '/legal/terms',
    },
    {
      id: 'privacy',
      label: t('Legal.privacyPolicy', 'Privacy Policy'),
      icon: Shield,
      url: '/legal/privacy',
    },
    {
      id: 'liability',
      label: t('Legal.liabilityWaiver', 'Ventally Support Guide Liability Waiver'),
      icon: Scale,
      url: '/legal/liability-waiver',
    },
    {
      id: 'payment-terms',
      label: t('Legal.paymentTerms', 'Ventally Payment Terms Acknowledgment'),
      icon: CreditCard,
      url: '/legal/payment-terms',
    },
    {
      id: 'listener-agreement',
      label: t('Legal.listenerAgreement', 'Ventally Support Guide Agreement'),
      icon: Users,
      url: '/legal/listener-agreement',
    },
    {
      id: 'nda',
      label: t('Legal.nda', 'Ventally Support Guide Non-Disclosure Agreement (NDA)'),
      icon: BookOpen,
      url: '/legal/nda',
    },
    {
      id: 'code-of-conduct',
      label: t('Legal.codeOfConduct', 'Ventally Support Guide Code Of Conduct'),
      icon: BookOpen,
      url: '/legal/code-of-conduct',
    },
    {
      id: 'safety',
      label: t('Legal.safetyPolicy', 'Safety Policy'),
      icon: Heart,
      url: '/legal/safety',
    },
    {
      id: 'guidelines',
      label: t('Legal.listenerGuidelines', 'Support Guide Guidelines'),
      icon: Headphones,
      url: '/legal/listener-guidelines',
    },
  ];

  const documents = isListener ? listenerDocuments : venterDocuments;

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Legal.title', 'Legal & Policies')} onBack={() => navigate(-1)} />

      <GlassCard padding="none" rounded="2xl">
        {documents.map(({ id, label, icon: Icon, url }, i) => (
          <a
            key={id}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={`settings-item flex justify-between items-center px-4 py-3 ${
              i === documents.length - 1 ? '' : 'border-b border-white/5'
            } cursor-pointer`}
            style={{ borderBottomWidth: i === documents.length - 1 ? 0 : undefined }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
                <Icon size={15} />
              </div>
              <span className="text-sm font-medium text-white leading-snug">{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
          </a>
        ))}
      </GlassCard>

      <p className="text-xs text-gray-600 text-center mt-4">
        By using Ventally, you agree to our Terms of Use and Privacy Policy.
      </p>
    </div>
  );
};

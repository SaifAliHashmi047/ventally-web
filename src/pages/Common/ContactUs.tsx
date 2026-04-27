import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { AccordionItem } from '../../components/Shared/AccordionItem';
import {
  Mail, Globe, Music2, Scale, ExternalLink
} from 'lucide-react';
import { cn } from '../../utils/cn';

// Social / contact links matching the RN app exactly
const CONTACT_LINKS = [
  {
    key: 'website',
    labelKey: 'Contact.website',
    icon: Globe,
    url: 'https://ventally.co/',
  },
  {
    key: 'facebook',
    labelKey: 'Contact.facebook',
    icon: ExternalLink,
    url: 'https://www.facebook.com/share/1DBvLkRmW4/?mibextid=wwXIfr',
  },
  {
    key: 'instagram',
    labelKey: 'Contact.instagram',
    icon: ExternalLink,
    url: 'https://www.instagram.com/ventally.co?igsh=bDBxaW42MzdmaTZn',
  },
  {
    key: 'twitter',
    labelKey: 'Contact.twitter',
    icon: ExternalLink,
    url: 'https://x.com/ventallyco',
  },
  {
    key: 'tiktok',
    labelKey: 'Contact.tiktok',
    icon: Music2,
    url: 'https://www.tiktok.com/@ventallyco?_r=1&_t=ZP-943pBMEKx1r',
  },
  {
    key: 'appeal',
    labelKey: 'Contact.appeal',
    icon: Scale,
    url: null, // internal navigation
    internal: true,
  },
];

export const ContactUs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const faqItems = useMemo(
    () => (t('FAQ.items', { returnObjects: true }) as any[]) || [],
    [t]
  );

  const handleContactLink = (link: typeof CONTACT_LINKS[0]) => {
    if (link.internal) {
      // Appeal screen — navigate internally
      const userPath = window.location.pathname.split('/')[1]; // 'venter' | 'listener'
      navigate(`/${userPath}/appeal`);
    } else if (link.url) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderFaq = useCallback(() => (
    <div className="space-y-3">
      {/* FAQ header */}
      <div className="text-center mb-4">
        <h2 className="text-base font-semibold text-white">{t('Contact.faq')}</h2>
        <p className="text-sm text-white/80 mt-1">{t('FAQ.subtitle')}</p>
      </div>

      {faqItems.map((item: any, index: number) => (
        // <GlassCard key={index} bordered padding="sm" rounded="2xl">
          <AccordionItem
            title={item.title}
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(prev => prev === index ? null : index)}
          >
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{item.description}</p>
          </AccordionItem>
        // </GlassCard>
      ))}
    </div>
  ), [expandedIndex, faqItems, t]);

  const renderContact = useCallback(() => (
    <div className="space-y-3">
      {/* Contact header */}
      <div className="text-center mb-4">
        <h2 className="text-base font-semibold text-white">{t('Contact.title')}</h2>
        <p className="text-sm text-white/80 mt-1">{t('FAQ.subtitle')}</p>
      </div>

      {/* Email Us — prominent card */}
      <GlassCard bordered className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => window.open('mailto:info@ventally.co', '_blank')}>
        <Mail size={24} className="text-primary mb-2" />
        <p className="text-sm font-medium text-white">{t('Contact.email')}</p>
      </GlassCard>

      {/* Social / other links */}
      {CONTACT_LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <GlassCard
            key={link.key}
            bordered
            hover
            onClick={() => handleContactLink(link)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 flex-shrink-0">
                <Icon size={16} />
              </div>
              <span className="text-sm font-medium text-white">{t(link.labelKey)}</span>
            </div>
          </GlassCard>
        );
      })}
    </div>
  ), [t]);

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={t('Contact.title')} onBack={() => navigate(-1)} />

      {/* Tabs — matching RN SwipeableTabs */}
      <div className="flex gap-1 glass rounded-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('faq')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            activeTab === 'faq'
              ? 'bg-white/10 text-white'
              : 'text-white/80 hover:text-gray-300'
          )}
        >
          {t('Contact.faq')}
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            activeTab === 'contact'
              ? 'bg-white/10 text-white'
              : 'text-white/80 hover:text-gray-300'
          )}
        >
          {t('Contact.title')}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'faq' ? renderFaq() : renderContact()}
    </div>
  );
};

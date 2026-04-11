import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { ChevronRight, FileText, Shield, Book } from 'lucide-react';

const DOCUMENTS = [
  { id: 'terms', label: 'Terms of Use', icon: FileText, url: '/legal/terms' },
  { id: 'privacy', label: 'Privacy Policy', icon: Shield, url: '/legal/privacy' },
  { id: 'safety', label: 'Safety Policy', icon: Shield, url: '/legal/safety' },
  { id: 'guidelines', label: 'Listener Guidelines', icon: Book, url: '/legal/listener-guidelines' },
];

export const LegalPolicies = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title="Legal & Policies" onBack={() => navigate(-1)} />

      <GlassCard padding="none" rounded="2xl">
        {DOCUMENTS.map(({ id, label, icon: Icon, url }, i) => (
          <a
            key={id}
            href={url}
            target="_blank"
            rel="noreferrer"
            className={`settings-item ${i === DOCUMENTS.length - 1 ? 'border-b-0' : ''} cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400">
                <Icon size={15} />
              </div>
              <span className="text-sm font-medium text-white">{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </a>
        ))}
      </GlassCard>

      <p className="text-xs text-gray-600 text-center">
        Last updated: January 2025. By using Ventally, you agree to our Terms of Use and Privacy Policy.
      </p>
    </div>
  );
};

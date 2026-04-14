import { useTranslation } from 'react-i18next';
import { OptionSelector } from '../../components/ui/OptionSelector';

export const SpecialTopicsSelect = () => {
  const { t } = useTranslation();
  return (
    <OptionSelector
      title={t('SpecialTopics.title', 'Special Topics')}
      storeKey="specialTopics"
      multiSelect
      options={[
        t('SpecialTopics.mentalHealth', 'Mental Health'),
        t('SpecialTopics.lifeIdentity', 'Life & Identity'),
        t('SpecialTopics.relationships', 'Relationships'),
        t('SpecialTopics.healthMedical', 'Health & Medical'),
        t('SpecialTopics.workFinances', 'Work & Finances'),
      ]}
    />
  );
};

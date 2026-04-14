import { useTranslation } from 'react-i18next';
import { OptionSelector } from '../../components/ui/OptionSelector';

export const AgeGroupSelect = () => {
  const { t } = useTranslation();
  return (
    <OptionSelector
      title={t('AgeGroup.title', 'Age Group')}
      storeKey="ageGroup"
      options={[
        t('AgeGroup.age18to24', '18 - 24'),
        t('AgeGroup.age25to34', '25 - 34'),
        t('AgeGroup.age35to44', '35 - 44'),
        t('AgeGroup.age45to54', '45 - 54'),
        t('AgeGroup.age55to64', '55 - 64'),
        t('AgeGroup.age65Plus', '65+'),
        t('AgeGroup.preferNotToSay', 'Prefer not to say'),
      ]}
    />
  );
};

import { useTranslation } from 'react-i18next';
import { OptionSelector } from '../../components/ui/OptionSelector';

export const EthnicitySelect = () => {
  const { t } = useTranslation();
  return (
    <OptionSelector
      title={t('Ethnicity.title', 'Ethnicity')}
      storeKey="ethnicity"
      options={[
        t('Ethnicity.africanDiaspora', 'African Diaspora'),
        t('Ethnicity.caribbean', 'Caribbean'),
        t('Ethnicity.northAfrican', 'North African'),
        t('Ethnicity.hispanic', 'Hispanic'),
        t('Ethnicity.pacificIslander', 'Pacific Islander'),
        t('Ethnicity.middleEastern', 'Middle Eastern'),
        t('Ethnicity.asian', 'Asian'),
        t('Ethnicity.indigenous', 'Indigenous'),
        t('Ethnicity.european', 'European'),
        t('Ethnicity.multiple', 'Multiple'),
        t('Ethnicity.other', 'Other'),
        t('Ethnicity.preferNotToSay', 'Prefer not to say'),
      ]}
    />
  );
};

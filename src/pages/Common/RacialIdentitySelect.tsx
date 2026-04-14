import { useTranslation } from 'react-i18next';
import { OptionSelector } from '../../components/ui/OptionSelector';

export const RacialIdentitySelect = () => {
  const { t } = useTranslation();
  return (
    <OptionSelector
      title={t('RacialIdentity.title', 'Racial Identity')}
      storeKey="culturalBackground"
      options={[
        t('RacialIdentity.black', 'Black'),
        t('RacialIdentity.white', 'White'),
        t('RacialIdentity.asian', 'Asian'),
        t('RacialIdentity.nativeIndian', 'Native Indian'),
        t('RacialIdentity.pacificIslander', 'Pacific Islander'),
        t('RacialIdentity.middleEastern', 'Middle Eastern'),
        t('RacialIdentity.northAfrican', 'North African'),
        t('RacialIdentity.multiracial', 'Multiracial'),
        t('RacialIdentity.other', 'Other'),
      ]}
    />
  );
};

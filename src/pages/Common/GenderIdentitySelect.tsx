import { useTranslation } from 'react-i18next';
import { OptionSelector } from '../../components/ui/OptionSelector';

export const GenderIdentitySelect = () => {
  const { t } = useTranslation();
  return (
    <OptionSelector
      title={t('GenderIdentity.title', 'Gender Identity')}
      storeKey="gender"
      options={[
        t('GenderIdentity.man', 'Man'),
        t('GenderIdentity.woman', 'Woman'),
        t('GenderIdentity.nonBinary', 'Non-binary'),
        t('GenderIdentity.genderNonConforming', 'Non-conforming'),
        t('GenderIdentity.questioning', 'Questioning'),
        t('GenderIdentity.preferNotToSay', 'Prefer not to say'),
      ]}
    />
  );
};

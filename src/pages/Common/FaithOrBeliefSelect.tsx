import { useTranslation } from 'react-i18next';
import { OptionSelector } from '../../components/ui/OptionSelector';

export const FaithOrBeliefSelect = () => {
  const { t } = useTranslation();
  return (
    <OptionSelector
      title={t('FaithOrBelief.title', 'Faith Or Belief')}
      storeKey="faithOrBelief"
      options={[
        t('FaithOrBelief.christian', 'Christian'),
        t('FaithOrBelief.muslim', 'Muslim'),
        t('FaithOrBelief.sikh', 'Sikh'),
        t('FaithOrBelief.hindu', 'Hindu'),
        t('FaithOrBelief.buddhist', 'Buddhist'),
        t('FaithOrBelief.jewish', 'Jewish'),
        t('FaithOrBelief.noReligion', 'No religion'),
        t('FaithOrBelief.spiritualNotReligious', 'Spiritual'),
        t('FaithOrBelief.other', 'Other'),
        t('FaithOrBelief.preferNotToSay', 'Prefer not to say'),
      ]}
    />
  );
};

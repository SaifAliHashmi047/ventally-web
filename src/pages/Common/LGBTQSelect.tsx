import { useTranslation } from 'react-i18next';
import { OptionSelector } from '../../components/ui/OptionSelector';

export const LGBTQSelect = () => {
  const { t } = useTranslation();
  return (
    <OptionSelector
      title={t('LGBTQIdentity.title', 'LGBTQ + Identity')}
      storeKey="lgbtqIdentity"
      options={[
        t('LGBTQIdentity.gay', 'Gay'),
        t('LGBTQIdentity.lesbian', 'Lesbian'),
        t('LGBTQIdentity.bisexual', 'Bisexual'),
        t('LGBTQIdentity.pansexual', 'Pansexual'),
        t('LGBTQIdentity.asexual', 'Asexual'),
        t('LGBTQIdentity.queer', 'Queer'),
        t('LGBTQIdentity.questioning', 'Questioning'),
        t('LGBTQIdentity.straightHeterosexual', 'Hetero'),
        t('LGBTQIdentity.preferNotToSay', 'Prefer not to say'),
      ]}
    />
  );
};

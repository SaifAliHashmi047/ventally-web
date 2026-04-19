import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { useDispatch, useSelector } from 'react-redux';
import { setPreferredLanguage, type PreferredLanguage } from '../../store/slices/appSlice';
import { updateUser } from '../../store/slices/userSlice';
import { updateProfile } from '../../api';
import { ArrowLeft } from 'lucide-react';

import en1 from '../../assets/icons/english1.png';
import en2 from '../../assets/icons/english2.png';
import en3 from '../../assets/icons/english3.png';
import pt1 from '../../assets/icons/portuguese1.png';
import pt2 from '../../assets/icons/portuguese2.png';
import pt3 from '../../assets/icons/portuguese3.png';
import fr1 from '../../assets/icons/french1.png';
import fr2 from '../../assets/icons/french2.png';
import fr3 from '../../assets/icons/french3.png';
import es1 from '../../assets/icons/spanish1.png';
import es2 from '../../assets/icons/spanish2.png';
import es3 from '../../assets/icons/spanish3.png';

export const LanguageSelection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const name = user?.displayName || user?.email?.split('@')[0] || 'User';

  const languages: { id: Exclude<PreferredLanguage, null>; name: string; flags: string[] }[] = [
    { id: 'en', name: t('LanguageSelection.languages.english'), flags: [en1, en2, en3] },
    { id: 'pt', name: t('LanguageSelection.languages.portuguese'), flags: [pt1, pt2, pt3] },
    { id: 'fr', name: t('LanguageSelection.languages.french'), flags: [fr1, fr2, fr3] },
    { id: 'es', name: t('LanguageSelection.languages.spanish'), flags: [es1, es2, es3] },
  ];

  const handleSelect = async (langId: PreferredLanguage) => {
    if (!langId) return;
    try {
      await updateProfile({ preferredLanguage: langId });
    } catch {
      /* still allow local preference if API fails */
    }
    dispatch(setPreferredLanguage(langId));
    dispatch(updateUser({ preferredLanguage: langId }));
    await i18n.changeLanguage(langId);
    navigate('/signup/terms', { state: { userType: location.state?.userType } });
  };

  return (
    <AuthLayout>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '8px' }}>
          {t('LanguageSelection.greeting')} {name}
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>{t('LanguageSelection.subtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {languages.map((lang) => (
          <div key={lang.id} className="glass card-hover" style={{ borderRadius: '20px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSelect(lang.id)}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>{lang.name}</h3>
            <div className="flex-center flex justify-center " style={{ gap: '8px', marginBottom: '20px' }}>
              {lang.flags.map((flag, idx) => (
                <img key={idx} src={flag} alt="flag" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', height: '36px', padding: '0', justifyContent: 'center', fontSize: '13px' }}>
              {t('Common.start')}
            </button>
          </div>
        ))}
      </div>
    </AuthLayout>
  );
};

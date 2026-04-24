import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { PageHeader } from '../../components/ui/PageHeader';
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
  const signupUserType =
    (location.state as { userType?: string } | null)?.userType ?? user?.userType ?? user?.role;

  const languages: { id: Exclude<PreferredLanguage, null>; name: string; flags: string[] }[] = [
    { id: 'en', name: t('LanguageSelection.languages.english'), flags: [en1, en2, en3] },
    { id: 'pt', name: t('LanguageSelection.languages.portuguese'), flags: [pt1, pt2, pt3] },
    { id: 'fr', name: t('LanguageSelection.languages.french'), flags: [fr1, fr2, fr3] },
    { id: 'es', name: t('LanguageSelection.languages.spanish'), flags: [es1, es2, es3] },
  ];

  const isSignupFlow = location.pathname.startsWith('/signup');

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

    if (isSignupFlow) {
      navigate('/signup/terms', { state: { userType: signupUserType }, replace: true });
    } else {
      navigate(-1);
    }
  };

  const content = (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center flex-1 py-4">
      {isSignupFlow ? (
        <button
          onClick={() => navigate(-1)}
          className="self-start flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} /> {t('Common.back', 'Back')}
        </button>
      ) : null}

      <div className="w-full mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          {t('LanguageSelection.greeting')} {name}
        </h1>
        <p className="text-white/80 text-[15px]">{t('LanguageSelection.subtitle')}</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 justify-items-center">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="glass card-hover w-full flex flex-col items-center justify-center text-center cursor-pointer"
            style={{ borderRadius: '20px', padding: '24px 16px' }}
            onClick={() => handleSelect(lang.id)}
          >
            <h3 className="text-base font-semibold text-white mb-4">{lang.name}</h3>
            <div className="flex justify-center items-center gap-2 mb-5">
              {lang.flags.map((flag, idx) => (
                <img
                  key={idx}
                  src={flag}
                  alt="flag"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ))}
            </div>
            <button
              className="btn-primary w-full flex items-center justify-center"
              style={{ height: '36px', padding: '0', fontSize: '13px' }}
            >
              {t('Common.start')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (isSignupFlow) {
    return <AuthLayout hideGlass>{content}</AuthLayout>;
  }

  return (
    <div className="page-wrapper page-wrapper--wide animate-fade-in">
      <PageHeader title={t('LanguageSelection.title', 'Language')} onBack={() => navigate(-1)} />
      {content}
    </div>
  );
};

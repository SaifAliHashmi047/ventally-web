import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Props = {
  title?: string;
  backTo?: string;
};

export const AuthStepHeader = ({ title, backTo }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        minHeight: '40px',
      }}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label={t('Common.back', 'Back')}
        className="auth-back-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.2)',
          color: 'var(--text-pure)',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>
      {title ? (
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-pure)', margin: 0 }}>{title}</h2>
      ) : null}
    </div>
  );
};

import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
};

export const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  autoComplete = 'current-password',
  hint,
}: Props) => {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label htmlFor={id} style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-main)' }}>
        {label}
      </label>
      <div className="input-password-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          style={{
            width: '100%',
            height: '52px',
            paddingRight: '48px',
          }}
        />
        <button
          type="button"
          className="input-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {hint ? (
        <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0 4px' }}>{hint}</p>
      ) : null}
    </div>
  );
};

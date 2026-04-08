import { useRef } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  cellCount?: number;
}

export const OTPInput = ({ value, onChange, cellCount = 4 }: OTPInputProps) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = val;
    const joined = newValue.join('');
    onChange(joined);

    // Auto-focus next input
    if (val && index < cellCount - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      {Array.from({ length: cellCount }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { if (el) inputs.current[i] = el; }}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e.target.value.replace(/\D/g, ''), i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          style={{
            width: '56px',
            height: '64px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: '700',
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border)',
            color: 'white',
            outline: 'none',
            transition: 'var(--transition-fast)'
          }}
          className="otp-input"
        />
      ))}
    </div>
  );
};

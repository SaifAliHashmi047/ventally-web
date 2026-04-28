import React from 'react';
import { useSelector } from 'react-redux';
import { getBackgroundStyle } from '../../utils/backgrounds';
import type { RootState } from '../../store/store';

export const MainBackground: React.FC = () => {
  const selectedBackgroundId = useSelector(
    (state: RootState) => (state.app as any)?.selectedBackgroundId ?? '1'
  );
  const customBackgrounds = useSelector(
    (state: RootState) => (state.app as any)?.customBackgrounds ?? []
  );
  const isDarkMode = useSelector(
    (state: RootState) => (state.app as any)?.isDarkMode ?? true
  );

  // Compute background style from Redux state
  const bgStyle = getBackgroundStyle(selectedBackgroundId, customBackgrounds);

  return (
    <>
      {/* ── Fixed background layer — sits behind everything ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          ...bgStyle,
          backgroundAttachment: 'fixed',
          backgroundColor: '#000000',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      {/* ── Dark overlay — only applied in dark mode ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-all duration-500"
        style={{
          background: isDarkMode ? 'rgba(0, 0, 0, 0.45)' : 'transparent',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      {/* ── Brand light mesh — shared across app + auth (does not replace image / glass) ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 120% 85% at 50% -12%, rgba(194, 174, 191, 0.12) 0%, transparent 52%), radial-gradient(ellipse 70% 55% at 100% 0%, rgba(10, 132, 255, 0.07) 0%, transparent 45%), radial-gradient(ellipse 60% 45% at 0% 100%, rgba(94, 92, 230, 0.06) 0%, transparent 42%)',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
    </>
  );
};

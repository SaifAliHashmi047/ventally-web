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
        }}
      />
      {/* ── Dark overlay — keeps theme colors consistent regardless of bg image ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'rgba(0, 0, 0, 0.55)' }}
      />
    </>
  );
};

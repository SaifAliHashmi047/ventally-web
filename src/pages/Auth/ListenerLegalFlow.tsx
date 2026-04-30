import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { useAccountChangeFlow } from '../../hooks/useAccountChangeFlow';
import { ArrowLeft, PenLine, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const LEGAL_STEPS = [
  { id: 'waiver', titleKey: 'ListenerLiabilityWaiver.title', contentKey: 'ListenerLiabilityWaiver' },
  { id: 'payment', titleKey: 'PaymentTermsAcknowledgment.title', contentKey: 'PaymentTermsAcknowledgment' },
  { id: 'agreement', titleKey: 'ListenerAgreement.title', contentKey: 'ListenerAgreement' },
  { id: 'nda', titleKey: 'ListenerNDA.title', contentKey: 'ListenerNDA' },
  { id: 'conduct', titleKey: 'ListenerCodeOfConduct.title', contentKey: 'ListenerCodeOfConduct' },
];

const LAST_STEP = LEGAL_STEPS.length - 1;

export const ListenerLegalFlow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [signatureEmpty, setSignatureEmpty] = useState(true);
  const [signatureError, setSignatureError] = useState(false);

  const { isAccountChanging, resolve } = useAccountChangeFlow();
  const legacyAccountTypeChanging = (location.state as any)?.accountTypeChanging;
  const effectiveChanging = isAccountChanging || legacyAccountTypeChanging;
  const step = LEGAL_STEPS[currentStep];
  const isLastStep = currentStep === LAST_STEP;

  // ── Signature canvas ──────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const getCanvasPos = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isDrawingRef.current = true;
    lastPosRef.current = { x, y };
    ctx.beginPath();
    ctx.arc(x, y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    setSignatureEmpty(false);
    setSignatureError(false);
  }, []);

  const draw = useCallback((x: number, y: number) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPosRef.current = { x, y };
  }, []);

  const endDraw = useCallback(() => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e.currentTarget, e.clientX, e.clientY);
    startDraw(pos.x, pos.y);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e.currentTarget, e.clientX, e.clientY);
    draw(pos.x, pos.y);
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getCanvasPos(e.currentTarget, touch.clientX, touch.clientY);
    startDraw(pos.x, pos.y);
  };
  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getCanvasPos(e.currentTarget, touch.clientX, touch.clientY);
    draw(pos.x, pos.y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureEmpty(true);
  };

  // Reset signature when leaving/returning to the last step
  useEffect(() => {
    if (!isLastStep) return;
    clearSignature();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLastStep]);
  // ─────────────────────────────────────────────────────────────────────────

  const handleContinue = () => {
    if (isLastStep) {
      if (signatureEmpty) {
        setSignatureError(true);
        return;
      }
      navigate(resolve('verification'));
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const sections = t(`${step.contentKey}.sections`, { returnObjects: true }) as any[];

  const legalContent = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={handleBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 600 }}>
          {currentStep + 1} / {LEGAL_STEPS.length}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-pure)' }}>{t(step.titleKey)}</h1>
      </div>

      <div style={{ height: isLastStep ? '280px' : '400px', overflowY: 'auto', paddingRight: '12px', marginBottom: '24px' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '16px' }}>{t(`${step.contentKey}.effectiveDate`)}</p>
        <p style={{ color: 'var(--text-pure)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>{t(`${step.contentKey}.introText1`)}</p>

        {t(`${step.contentKey}.introText2`) !== `${step.contentKey}.introText2` && (
          <p style={{ color: 'var(--text-pure)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>{t(`${step.contentKey}.introText2`)}</p>
        )}

        {sections && Array.isArray(sections) && sections.map((section: any, idx: number) => (
          <div key={idx} style={{ marginBottom: '24px' }}>
            {section.title && <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '12px' }}>{section.title}</h3>}

            {section.paragraphs && section.paragraphs.map((para: string, pIdx: number) => (
              <p key={pIdx} style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>{para}</p>
            ))}

            {section.bullets && (
              <ul style={{ paddingLeft: '16px', marginBottom: '12px' }}>
                {section.bullets.map((bullet: string, bIdx: number) => (
                  <li key={bIdx} style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px', listStyleType: 'disc' }}>
                    {bullet.startsWith('• ') ? bullet.substring(2) : bullet}
                  </li>
                ))}
              </ul>
            )}

            {section.subsections && section.subsections.map((sub: any, sIdx: number) => (
              <div key={sIdx} style={{ marginBottom: '16px' }}>
                {sub.title && <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '8px' }}>{sub.title}</h4>}
                {sub.text && <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>{sub.text}</p>}
                {sub.bullets && (
                  <ul style={{ paddingLeft: '16px', marginBottom: '12px' }}>
                    {sub.bullets.map((bullet: string, bIdx: number) => (
                      <li key={bIdx} style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px', listStyleType: 'disc' }}>
                        {bullet.startsWith('• ') ? bullet.substring(2) : bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}

        {t(`${step.contentKey}.signatures.title`) !== `${step.contentKey}.signatures.title` && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '12px' }}>{t(`${step.contentKey}.signatures.title`)}</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6' }}>{t(`${step.contentKey}.signatures.text`)}</p>
          </div>
        )}
      </div>

      {/* Signature pad — only on last step */}
      {isLastStep && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PenLine size={16} color="rgba(255,255,255,0.7)" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                {t('ListenerLegalFlow.signatureLabel', 'Your Signature')}
              </span>
            </div>
            <button
              onClick={clearSignature}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.5)' }}
            >
              <RotateCcw size={13} />
              <span style={{ fontSize: '12px' }}>{t('Common.clear', 'Clear')}</span>
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={130}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={endDraw}
            style={{
              width: '100%',
              height: '130px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
              border: signatureError ? '1.5px solid rgba(255,82,82,0.7)' : '1.5px dashed rgba(255,255,255,0.15)',
              cursor: 'crosshair',
              display: 'block',
              touchAction: 'none',
            }}
          />

          {signatureEmpty && !signatureError && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '8px' }}>
              {t('ListenerLegalFlow.signaturePlaceholder', 'Draw your signature above')}
            </p>
          )}
          {signatureError && (
            <p style={{ fontSize: '12px', color: 'rgba(255,82,82,0.9)', textAlign: 'center', marginTop: '8px' }}>
              {t('ListenerLegalFlow.signatureRequired', 'Please sign before continuing')}
            </p>
          )}
        </div>
      )}

      <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
        {isLastStep ? t('Common.signAndContinue', 'Sign & Continue') : t('Common.acceptAndContinue')}
      </Button>
    </>
  );

  if (effectiveChanging) {
    return <div className="page-wrapper page-wrapper--wide animate-fade-in">{legalContent}</div>;
  }
  return <AuthLayout>{legalContent}</AuthLayout>;
};

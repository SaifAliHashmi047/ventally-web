import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { getMicPermissionState, requestMicrophonePermission } from '../utils/permissions';

type ModalState = 'idle' | 'asking' | 'requesting' | 'denied';

export function useMicPermission() {
  const [modalState, setModalState] = useState<ModalState>('idle');
  const resolveRef = useRef<((granted: boolean) => void) | null>(null);

  const ensureMicPermission = useCallback((): Promise<boolean> => {
    return new Promise(async (resolve) => {
      resolveRef.current = resolve;
      const state = await getMicPermissionState();
      if (state === 'granted') { resolve(true); return; }
      if (state === 'denied') { setModalState('denied'); return; }
      setModalState('asking');
    });
  }, []);

  const handleAllow = useCallback(async () => {
    setModalState('requesting');
    const granted = await requestMicrophonePermission();
    if (granted) {
      setModalState('idle');
      resolveRef.current?.(true);
      resolveRef.current = null;
    } else {
      setModalState('denied');
    }
  }, []);

  const handleCancel = useCallback(() => {
    setModalState('idle');
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  const MicPermissionModal = useCallback(() => {
    if (modalState === 'idle') return null;

    const isDenied = modalState === 'denied';
    const isRequesting = modalState === 'requesting';

    return (
      <div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-5 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div
          className="w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl px-6 pt-8 pb-10"
          style={{
            background: 'rgba(18,18,22,0.95)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* drag handle — mobile only */}
          <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-7 sm:hidden" />

          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: isDenied ? 'rgba(255,82,82,0.10)' : 'rgba(var(--color-primary-rgb,130,94,255),0.12)' }}
          >
            {isDenied
              ? <MicOff size={22} strokeWidth={1.8} className="text-red-400" />
              : <Mic size={22} strokeWidth={1.8} className="text-primary" />
            }
          </div>

          {isDenied ? (
            <>
              <h3 className="text-[17px] font-semibold text-white mb-2 tracking-tight">
                Microphone access blocked
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Your browser is blocking microphone access. Tap the <span className="text-white/75">lock icon</span> in the address bar, open <span className="text-white/75">Site permissions</span>, and set Microphone to <span className="text-white/75">Allow</span>. Then try again.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => void handleAllow()}
                  className="w-full py-3.5 rounded-2xl bg-primary text-white font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Try again
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-3 text-white/35 text-sm hover:text-white/55 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-[17px] font-semibold text-white mb-2 tracking-tight">
                Allow microphone access
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
               Ventally needs your microphone access to connect the call. When your browser asks, tap <span className="text-white/75">Allow</span>.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => void handleAllow()}
                  disabled={isRequesting}
                  className="w-full py-3.5 rounded-2xl bg-primary text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRequesting ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : 'Continue'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isRequesting}
                  className="w-full py-3 text-white/35 text-sm hover:text-white/55 transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }, [modalState, handleAllow, handleCancel]);

  return { ensureMicPermission, MicPermissionModal };
}

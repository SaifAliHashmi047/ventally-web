import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import type { AudioDeviceInfo } from '../../contexts/AgoraContext';

interface Props {
  devices: AudioDeviceInfo[];
  onSelect: (deviceId: string) => void;
  label: string;
  activeDeviceId?: string | null;
}

/**
 * Small chevron badge on a button. Clicking opens a bottom-sheet modal
 * rendered via portal into document.body so it escapes all card/overflow
 * stacking contexts and sits cleanly over the full screen.
 * Parent button must have `relative` positioning.
 */
export function DevicePickerButton({ devices, onSelect, label, activeDeviceId }: Props) {
  const [open, setOpen] = useState(false);

  if (devices.length <= 1) return null;

  // Fall back to the first device if nothing is explicitly selected
  const resolvedActiveId = activeDeviceId ?? devices[0]?.deviceId;

  const modal = open && document.body
    ? createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle — mobile only */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-1 sm:hidden" />
            <div className="px-6 py-4 border-b border-white/10">
              <p className="text-sm font-semibold text-white">{label}</p>
            </div>
            {devices.map((device) => {
              const isActive = device.deviceId === resolvedActiveId;
              return (
                <button
                  key={device.deviceId}
                  type="button"
                  onClick={() => { onSelect(device.deviceId); setOpen(false); }}
                  className={`w-full px-6 py-4 text-left text-sm transition-colors border-b border-white/5 last:border-0 flex items-center justify-between gap-3 ${isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/8'}`}
                >
                  <span className="truncate">{device.label}</span>
                  {isActive && <Check size={15} className="text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white/25 border border-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
        aria-label={`Select ${label}`}
      >
        <ChevronDown size={10} className="text-white" />
      </button>
      {modal}
    </>
  );
}

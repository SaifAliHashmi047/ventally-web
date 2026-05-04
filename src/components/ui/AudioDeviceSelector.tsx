import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Volume2, ChevronDown, Check, Headphones } from 'lucide-react';
import { useAgoraContext, type AudioDeviceInfo } from '../../contexts/AgoraContext';

/**
 * Dropdown-style audio device selector for active calls.
 * Shows available microphone (input) and speaker (output) devices.
 * Automatically refreshes when devices are plugged/unplugged.
 */
export const AudioDeviceSelector = () => {
  const { t } = useTranslation();
  const { getAudioDevices, setMicDevice, setOutputDevice, activeMicId, activeOutputId } =
    useAgoraContext();

  const [inputs, setInputs] = useState<AudioDeviceInfo[]>([]);
  const [outputs, setOutputs] = useState<AudioDeviceInfo[]>([]);
  const [openSection, setOpenSection] = useState<'mic' | 'speaker' | null>(null);

  const refreshDevices = useCallback(async () => {
    const { inputs: i, outputs: o } = await getAudioDevices();
    setInputs(i);
    setOutputs(o);
  }, [getAudioDevices]);

  // Initial load + listen for device changes (plug/unplug)
  useEffect(() => {
    refreshDevices();
    const handler = () => void refreshDevices();
    navigator.mediaDevices?.addEventListener?.('devicechange', handler);
    return () => navigator.mediaDevices?.removeEventListener?.('devicechange', handler);
  }, [refreshDevices]);

  // Nothing to show if only one device each (or none)
  if (inputs.length <= 1 && outputs.length <= 1) return null;

  const toggleSection = (section: 'mic' | 'speaker') => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleSelectMic = async (deviceId: string) => {
    await setMicDevice(deviceId);
    setOpenSection(null);
  };

  const handleSelectOutput = async (deviceId: string) => {
    await setOutputDevice(deviceId);
    setOpenSection(null);
  };

  /** Shorten long device labels like "Jabra EVOLVE 20 MS (0b0e:0300)" → "Jabra EVOLVE 20 MS" */
  const shortLabel = (label: string) => {
    return label.replace(/\s*\([0-9a-f:]+\)\s*$/i, '').trim() || label;
  };

  const resolvedMicId = activeMicId || inputs[0]?.deviceId || 'default';
  const resolvedOutputId = activeOutputId || outputs[0]?.deviceId || 'default';

  return (
    <div className="w-full space-y-2">
      {/* Microphone selector */}
      {inputs.length > 1 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleSection('mic')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <Mic size={16} className="text-white/60 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                {t('AudioDevices.microphone', 'Microphone')}
              </p>
              <p className="text-sm text-white truncate">
                {shortLabel(inputs.find((d) => d.deviceId === resolvedMicId)?.label || t('AudioDevices.default', 'Default'))}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-white/40 transition-transform ${openSection === 'mic' ? 'rotate-180' : ''}`}
            />
          </button>

          {openSection === 'mic' && (
            <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl animate-fade-in">
              {inputs.map((device) => (
                <button
                  key={device.deviceId}
                  type="button"
                  onClick={() => handleSelectMic(device.deviceId)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                >
                  <Headphones size={14} className="text-white/40 flex-shrink-0" />
                  <span className="text-sm text-white flex-1 truncate">
                    {shortLabel(device.label)}
                  </span>
                  {device.deviceId === resolvedMicId && (
                    <Check size={14} className="text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Speaker/output selector */}
      {outputs.length > 1 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleSection('speaker')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <Volume2 size={16} className="text-white/60 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                {t('AudioDevices.speaker', 'Speaker')}
              </p>
              <p className="text-sm text-white truncate">
                {shortLabel(outputs.find((d) => d.deviceId === resolvedOutputId)?.label || t('AudioDevices.default', 'Default'))}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-white/40 transition-transform ${openSection === 'speaker' ? 'rotate-180' : ''}`}
            />
          </button>

          {openSection === 'speaker' && (
            <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl animate-fade-in">
              {outputs.map((device) => (
                <button
                  key={device.deviceId}
                  type="button"
                  onClick={() => handleSelectOutput(device.deviceId)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                >
                  <Headphones size={14} className="text-white/40 flex-shrink-0" />
                  <span className="text-sm text-white flex-1 truncate">
                    {shortLabel(device.label)}
                  </span>
                  {device.deviceId === resolvedOutputId && (
                    <Check size={14} className="text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

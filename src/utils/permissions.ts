/**
 * Requests microphone access from the browser.
 * Must be called directly inside a user-gesture handler (button click) so that
 * mobile browsers (iOS Safari, Samsung Internet, Chrome Android) show the
 * permission prompt. Calling getUserMedia from a useEffect or a socket callback
 * is too far removed from the gesture and the prompt is silently blocked.
 *
 * Returns true if permission was granted, false if denied or unavailable.
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  if (!navigator.mediaDevices?.getUserMedia) return false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Release immediately — Agora will re-acquire the mic track when joining
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks current mic permission state without triggering a prompt.
 * Returns 'granted' | 'denied' | 'prompt' | 'unknown'.
 */
export async function getMicPermissionState(): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return result.state;
  } catch {
    return 'unknown';
  }
}

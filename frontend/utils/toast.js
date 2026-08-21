import { toast } from 'react-toastify';

/**
 * Extract a safe, user-facing error message from an error object.
 * Priority: backend message → backend error → err.message → fallback
 *
 * @param {unknown} err - The caught error
 * @param {string} [fallback] - Generic fallback message
 * @returns {string}
 */
export function extractErrorMessage(
  err,
  fallback = 'Something went wrong. Please try again.'
) {
  // Axios response error with backend JSON body
  const backendMsg =
    err?.response?.data?.message ||
    err?.response?.data?.error;

  if (backendMsg && typeof backendMsg === 'string') {
    // Never expose technical internals — these patterns get the fallback
    const unsafe = /stack trace|at Object|ECONNREFUSED|sql|mongodb|syntax error/i;
    if (!unsafe.test(backendMsg)) return backendMsg;
  }

  // Network-level error (no response received)
  if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
    return 'Unable to connect to the server. Please try again.';
  }

  // Generic JS Error message (only if not sensitive)
  if (err?.message && typeof err.message === 'string') {
    const unsafe = /stack|undefined|null|cannot read|is not a function/i;
    if (!unsafe.test(err.message)) return err.message;
  }

  return fallback;
}

/** Show a success toast */
export function toastSuccess(message) {
  toast.success(message, { toastId: message });
}

/** Show an error toast — accepts a string message or an Error object */
export function toastError(messageOrErr, fallback) {
  const message =
    typeof messageOrErr === 'string'
      ? messageOrErr
      : extractErrorMessage(messageOrErr, fallback);

  toast.error(message, { toastId: message });
}

/** Show an info toast */
export function toastInfo(message) {
  toast.info(message, { toastId: message });
}

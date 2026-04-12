/**
 * Splash dismissal is stored in both sessionStorage (per tab) and localStorage
 * (permanent “don’t show again”). Hero and Splash must use the exact same logic.
 */

export const SPLASH_STORAGE_KEY = "da-splash-v2";

/** True if this tab should never show the splash (matches SplashScreen guards). */
export function isSplashDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(SPLASH_STORAGE_KEY)) return true;
  } catch {
    /* private mode / blocked storage */
  }
  try {
    if (sessionStorage.getItem(SPLASH_STORAGE_KEY)) return true;
  } catch {
    /* ignore */
  }
  return false;
}

export function getRemainingTime(
  dismissedUntil?: number
): number {

  if (!dismissedUntil) {
    return 0;
  }

  const now = Date.now();
  const remaining = dismissedUntil - now;

  return Math.max(0, remaining);
}

export function formatRemainingTime(milliseconds: number): string {
  if (milliseconds <= 0) {
    return 'Expired';
  }

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  return `${seconds} second${seconds === 1 ? '' : 's'}`;
}
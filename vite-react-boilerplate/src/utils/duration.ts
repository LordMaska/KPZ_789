/**
 * Duration type - can be string or object
 */
export type Duration = string | {
  hours?: number;
  minutes?: number;
  seconds?: number;
};

/**
 * Format duration to readable Ukrainian string
 * @param duration - Duration as string or object
 * @returns Formatted duration string (e.g., "2г 30хв")
 */
export function formatDuration(duration: Duration): string {
  if (typeof duration === 'string') {
    return duration;
  }
  
  if (typeof duration === 'object' && duration !== null) {
    const parts: string[] = [];
    if (duration.hours) parts.push(`${duration.hours}г`);
    if (duration.minutes) parts.push(`${duration.minutes}хв`);
    if (duration.seconds) parts.push(`${duration.seconds}с`);
    return parts.length > 0 ? parts.join(' ') : '0с';
  }
  
  return String(duration);
}

/**
 * Convert duration object to HH:MM:SS string for input fields
 * @param duration - Duration as string or object
 * @returns Time string in HH:MM:SS format
 */
export function durationToTimeString(duration: Duration): string {
  if (typeof duration === 'string') {
    return duration;
  }
  
  if (typeof duration === 'object' && duration !== null) {
    const hours = String(duration.hours || 0).padStart(2, '0');
    const minutes = String(duration.minutes || 0).padStart(2, '0');
    const seconds = String(duration.seconds || 0).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  return '';
}

/**
 * Parse time string (HH:MM:SS) to duration object
 * @param timeString - Time in HH:MM:SS format
 * @returns Duration object
 */
export function parseTimeString(timeString: string): { hours: number; minutes: number; seconds: number } {
  const parts = timeString.split(':').map(Number);
  return {
    hours: parts[0] || 0,
    minutes: parts[1] || 0,
    seconds: parts[2] || 0,
  };
}

/**
 * Format date to localized string
 * @param date - Date as string, Date object, or timestamp
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Locale string (default: 'uk-UA')
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | number,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'uk-UA'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Н/Д';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return dateObj.toLocaleDateString(locale, defaultOptions);
}

/**
 * Format date and time to localized string
 * @param date - Date as string, Date object, or timestamp
 * @param locale - Locale string (default: 'uk-UA')
 * @returns Formatted datetime string
 */
export function formatDateTime(
  date: string | Date | number,
  locale: string = 'uk-UA'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Н/Д';
  }

  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date for input[type="date"] or input[type="datetime-local"]
 * @param date - Date as string, Date object, or timestamp
 * @param includeTime - Whether to include time (for datetime-local)
 * @returns ISO format string for input field
 */
export function formatDateForInput(
  date: string | Date | number,
  includeTime: boolean = false
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  if (includeTime) {
    // Format: YYYY-MM-DDTHH:mm
    return dateObj.toISOString().slice(0, 16);
  }

  // Format: YYYY-MM-DD
  return dateObj.toISOString().slice(0, 10);
}

/**
 * Get relative time string (e.g., "2 години тому")
 * @param date - Date as string, Date object, or timestamp
 * @param locale - Locale string (default: 'uk-UA')
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: string | Date | number,
  locale: string = 'uk-UA'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Н/Д';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'щойно';
  if (diffMinutes < 60) return `${diffMinutes} хв тому`;
  if (diffHours < 24) return `${diffHours} год тому`;
  if (diffDays < 7) return `${diffDays} дн тому`;

  return formatDate(dateObj, undefined, locale);
}

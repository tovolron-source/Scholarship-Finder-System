/**
 * Debounce a function to prevent rapid repeated calls
 * @param func - The function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function to limit how often it can be called
 * Useful for preventing multiple simultaneous API calls
 * @param func - The function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => Promise<any>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => Promise<any> {
  let inThrottle = false;

  return async function (...args: Parameters<T>) {
    if (!inThrottle) {
      inThrottle = true;
      try {
        return await func(...args);
      } finally {
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    }
  };
}

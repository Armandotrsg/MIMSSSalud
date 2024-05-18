import { useState, useEffect } from 'react';

/**
 * useDebounce hook to debounce a value in a component
 * @param {T} value 
 * @param {number} delay
 * @returns {T} debouncedValue after delay
 * 
 * @since 2023-11-19
 * @author Armando Terrazas
 */
export default function useDebounce<T>(value: T, delay = 250) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run effect if value or delay changes

  return debouncedValue;
}

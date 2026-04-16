import { useEffect, useCallback } from "react";

interface FormPersistenceOptions {
  key: string;
  debounceMs?: number;
}

/**
 * Hook to persist form data to localStorage
 * Automatically saves form values as they change
 * Loads previously saved data on mount
 */
export function useFormPersistence<T>(
  formData: T,
  onLoad: (data: T) => void,
  options: FormPersistenceOptions
) {
  const { key, debounceMs = 500 } = options;

  // Load persisted data on mount only - onLoad is wrapped in useCallback to prevent infinite loops
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        onLoad(parsed);
      }
    } catch (error) {
      console.error(`Failed to load form data from localStorage:`, error);
    }
    // Only run on mount - ignore onLoad as it's wrapped in useCallback from parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Save form data with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(formData));
      } catch (error) {
        console.error(`Failed to save form data to localStorage:`, error);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [formData, key, debounceMs]);
}

/**
 * Clear persisted form data
 */
export function clearFormPersistence(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to clear form data:`, error);
  }
}

/**
 * Get persisted form data without triggering a load
 */
export function getPersistedFormData<T>(key: string): T | null {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error(`Failed to get persisted form data:`, error);
    return null;
  }
}

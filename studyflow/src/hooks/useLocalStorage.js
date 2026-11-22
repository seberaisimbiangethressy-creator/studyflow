import { useEffect, useState } from "react";

/**
 * useState that survives a page refresh.
 * - Reads the saved value once (lazy initial state), falling back to initialValue.
 * - Saves to localStorage in an Effect whenever the value changes.
 * The returned setter is the plain useState setter, so it is stable and accepts
 * functional updates: setValue((prev) => ...).
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      // Corrupted JSON or storage blocked: start from the default.
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or disabled (private mode): the app still works in memory.
    }
  }, [key, value]);

  return [value, setValue];
}

import { useCallback, useState } from "react";

/** Boolean state with a stable toggle function: const [open, toggleOpen, setOpen] = useToggle(). */
export default function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((current) => !current), []);
  return [value, toggle, setValue];
}

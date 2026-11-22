import { useEffect } from "react";

/** Keeps the browser tab title in sync with the current page / pending count. */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

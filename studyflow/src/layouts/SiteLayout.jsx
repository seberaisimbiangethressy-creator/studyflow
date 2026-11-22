import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Badge from "../components/Badge";
import useDocumentTitle from "../hooks/useDocumentTitle";

const pageTitles = {
  "/": "Dashboard",
  "/tasks": "Tasks",
  "/focus": "Focus",
  "/settings": "Settings",
};

/**
 * The shell shared by every route: skip link, header, navigation and the page container.
 * React Router renders the current page in <Outlet />. Because this layout stays mounted
 * while the page inside it changes, the header and navigation never reset.
 */
export default function SiteLayout({ pendingCount, displayName }) {
  const { pathname } = useLocation();
  const pageTitle = pageTitles[pathname] ?? "Page not found";

  // Effect lives in a custom Hook: tab title follows the page and pending count.
  useDocumentTitle(`${pendingCount > 0 ? `(${pendingCount}) ` : ""}${pageTitle} | StudyFlow`);

  return (
    <div className="min-h-screen md:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-navy"
      >
        Skip to content
      </a>

      <Navbar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-8">
            <p className="text-lg font-bold text-navy md:hidden">StudyFlow</p>
            <p className="hidden text-sm text-slate-600 md:block">
              Signed in as <span className="font-semibold text-navy">{displayName}</span>
            </p>
            <div className="flex items-center gap-3">
              <Badge tone={pendingCount > 0 ? "pending" : "completed"}>
                {pendingCount} pending
              </Badge>
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white"
              >
                {displayName.trim().charAt(0).toUpperCase() || "S"}
              </span>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

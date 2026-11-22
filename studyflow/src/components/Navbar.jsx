import { NavLink } from "react-router-dom";
import Icon from "./Icon";

const links = [
  { to: "/", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/tasks", label: "Tasks", icon: "tasks" },
  { to: "/focus", label: "Focus", icon: "focus" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

/**
 * One navigation component, two layouts (pure CSS):
 *  - phones: fixed bottom bar with four equal tabs
 *  - md+   : sticky sidebar
 * NavLink adds aria-current="page" and tells us when a link is active.
 */
export default function Navbar() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navy text-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-t-0 md:p-5"
    >
      <div className="mb-8 hidden items-center gap-3 md:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-teal-300">
          <Icon name="tasks" />
        </span>
        <span className="text-xl font-bold tracking-tight">StudyFlow</span>
      </div>

      <ul className="grid grid-cols-4 md:grid-cols-1 md:gap-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 border-t-4 px-2 py-2 text-xs font-medium focus-visible:outline-white md:flex-row md:gap-3 md:rounded-lg md:border-t-0 md:px-3 md:py-2.5 md:text-sm ${
                  isActive
                    ? "border-teal-300 bg-white/10 text-white"
                    : "border-transparent text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon name={link.icon} />
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <p className="mt-auto hidden pt-8 text-xs text-slate-300 md:block">
        Everything is saved in this browser only.
      </p>
    </nav>
  );
}

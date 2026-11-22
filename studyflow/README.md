# StudyFlow

A responsive study-planning website built with **React 19, React Router DOM, Vite and Tailwind CSS**.
Four connected pages (Dashboard, Tasks, Focus, Settings) share one header, navigation and page container.
Frontend only: no API, `fetch`, database or authentication. All data is local JavaScript plus `localStorage`.

- **Live site:** https://studyflow-ass.vercel.app
- **Video walkthrough (3-5 min):**https://youtu.be/jH4ZmWkTjTI
- **GitHub:** _add your repository URL here_

## Run it

```bash
npm install
npm run dev      # development server
npm run build    # production build into dist/
npm run preview  # try the production build locally
```

## Pages and routes

| Page | URL | What it does |
| --- | --- | --- |
| Dashboard | `/` | Welcome message, 4 summary cards, progress bar, upcoming tasks, link to Tasks, focus preview |
| Tasks | `/tasks` | Add / edit / delete / complete, search, category + status filters, sorting, validation |
| Focus | `/focus` | Start / Pause / Reset timer, Study vs Break sessions, session counter |
| Settings | `/settings` | Display name, study minutes, break minutes, compact-cards preference |
| Not Found | `*` | Friendly 404 with a link back to the Dashboard |

Routing uses `BrowserRouter`, `Routes`, `Route` (a layout route with `<Outlet />`) and `NavLink`/`Link`.
`NavLink` gives the active style and `aria-current="page"`.

**Refreshing `/tasks`, `/focus` or `/settings` on the live site:** the SPA fallback is configured for both
hosts - `vercel.json` (rewrite everything to `/index.html`) and `public/_redirects` (Netlify).

## Project structure

```
src/
  components/  Button, Badge, SectionCard, SummaryCard, ProgressBar, EmptyState, TextField,
               SelectField, Icon, Navbar, TaskCard, TaskForm, TaskFilters, FocusTimer, TimerControls
  pages/       DashboardPage, TasksPage, FocusPage, SettingsPage, NotFoundPage
  hooks/       useLocalStorage, useToggle, useDocumentTitle, useDebounce
  data/        initialTasks.js, categories.js, defaultSettings.js
  layouts/     SiteLayout.jsx (shared shell)
  utils/       tasks.js (stats, filter + sort), dates.js
  App.jsx      routes + shared state
  main.jsx     entry point
```

## Component tree

```
App  (owns tasks + settings state)
└─ BrowserRouter
   └─ SiteLayout  (header, skip link, page container, <Outlet />)
      ├─ Navbar
      ├─ DashboardPage ── SummaryCard x4, SectionCard, ProgressBar, Badge, Button
      ├─ TasksPage ────── TaskFilters (TextField, SelectField), TaskForm, TaskCard x n, EmptyState
      ├─ FocusPage ────── SectionCard, Button, FocusTimer (key = session) ── ProgressBar, TimerControls
      ├─ SettingsPage ─── SectionCard, TextField, Button
      └─ NotFoundPage ─── SectionCard
```

## Which component owns the shared task state, and why

**`App.jsx` owns `tasks` (and `settings`).** It stays mounted while the route changes, so the data is not
lost when you move between pages. It passes `tasks` down as props and passes `addTask`, `updateTask`,
`toggleTask` and `deleteTask` as callback props. Because the Dashboard, Tasks and Focus pages all read the
same array, editing a task on `/tasks` updates the Dashboard immediately with no reload.

Other state is kept as close as possible to where it is used:

- Search / filter / sort text and which form is open: `TasksPage`
- Form field values and errors: `TaskForm`, `SettingsPage`
- Timer seconds and running flag: `FocusTimer`

## Immutable updates

Tasks are never mutated. Add uses spread (`[...current, newTask]`), edit and toggle use `map` plus
`{ ...task, ...changes }`, delete uses `filter`. Sorting copies first (`[...filtered].sort(...)`).

## Derived values (not stored twice)

Dashboard counts, the progress percentage, the pending badge in the header, the upcoming list and the
filtered/sorted task list are all computed from `tasks` while rendering. No Effect is used to calculate them.

## Custom Hooks

| Hook | Where it is used | Why |
| --- | --- | --- |
| `useLocalStorage(key, initial)` | `App` (tasks, settings) | State that survives a refresh; safe if storage is blocked or corrupted |
| `useToggle(initial)` | `TasksPage` (show / hide the form) | Boolean state with a stable toggle function |
| `useDocumentTitle(title)` | `SiteLayout` | Tab title shows the current page and pending count, e.g. `(4) Tasks \| StudyFlow` |
| `useDebounce(value, delay)` | `TasksPage` (search box) | Filters after you stop typing instead of on every keystroke |

## Refs

- **Focus a field through a ref:** `TasksPage` creates `searchRef` and passes it to `TaskFilters`, which
  passes it to `TextField`. Using the **React 19 `ref` prop** (no `forwardRef`), it lands on the real
  `<input>`. "Clear filters" calls `searchRef.current.focus()`. `TaskForm` also focuses the title field when it
  opens and focuses the first invalid field after a failed submit.
- **Timer interval id:** `FocusTimer` stores the interval id in `intervalRef`. It is not shown on screen, so
  changing it should not re-render.

## Effects and cleanup

- `useLocalStorage` saves in an Effect when the value changes.
- `useDocumentTitle` updates `document.title`.
- `FocusTimer` starts **one** `setInterval` only while the timer is ticking; the cleanup calls
  `clearInterval`. It runs on Pause, on finish, on Reset and when you leave `/focus`, so revisiting the page
  never creates duplicate intervals. (React Strict Mode double-runs Effects in development specifically to
  prove the cleanup is correct.)
- `useDebounce`, the "task added" message and the "settings saved" message each clear their `setTimeout` in cleanup.

## Rendering (React thinking)

**State placement.** The timer ticks every second. Its state lives inside `FocusTimer`, so a tick re-renders
only the timer, not `App`, the header, the navigation or the task list.

**Key reset.** `FocusPage` renders `<FocusTimer key={mode} ... />`. Switching between Study and Break changes
the key, so React unmounts the old timer and mounts a new one with fresh state - the countdown resets with no
manual reset code.

**Observing renders.** In development `TaskCard` and `FocusTimer` log `[render] ...` to the console (guarded
by `import.meta.env.DEV`, so nothing is logged in production). You can also use the React DevTools Profiler.
Things to try: type in the Tasks search box and watch that `TaskCard`s do **not** re-render; toggle one task and
watch that only that card re-renders; start the timer and watch that only `FocusTimer` renders each second.

**Rendering is not always a DOM change.** "Rendering" means React calls your component function to work out
what the UI should look like. React then compares the result with the previous one and only touches the real
DOM where something differs. A component can render and produce identical output, in which case the DOM is left alone.

**Memoization (justified).**

- `useMemo` in `TasksPage` caches the filtered + sorted list so it is not recomputed when the page re-renders
  for an unrelated reason (for example opening the form).
- `memo(TaskCard)` plus `useCallback` handlers: while typing in the search box `TasksPage` re-renders on every
  keystroke, but each card's props are unchanged (unchanged tasks keep the same object thanks to immutable
  updates, and the callbacks are stable), so the cards are skipped.

For a list this small these are modest gains; they are included to show the pattern and what it depends on
(immutable updates and stable callbacks). `useCallback` is used only where a memoized child receives the function.

**React Compiler.** The React Compiler can automate much of this memoization at build time, which means
hand-written `useMemo`/`useCallback`/`memo` is needed less often. No compiler setup is required for this project.

## Accessibility and design

- One palette (navy + teal accent), one system font stack and one `Button` style on every page.
- Sidebar on desktop; fixed bottom navigation on phones. No horizontal scrolling at phone widths.
- Every input has a visible `<label>`; errors are linked with `aria-describedby`; visible keyboard focus;
  a "Skip to content" link; status messages use `role="status"`.
- Badges for priority and status (pending, completed, overdue); separate, helpful empty states.
- Responsive Tailwind utilities such as `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` and `md:grid-cols-3`.

## Acceptance checklist

- [ ] Each nav item opens the correct page; refresh on `/tasks`, `/focus`, `/settings` works after deployment
- [ ] Editing a task updates Tasks and Dashboard with no reload
- [ ] Blank title is rejected; add / edit / delete / complete act on the right task
- [ ] Search + filter + sort work together; "no tasks" and "no matching tasks" messages differ
- [ ] Tasks and settings survive a refresh
- [ ] Start / Pause / Reset work; no duplicate intervals after leaving and returning to Focus
- [ ] `npm run build` succeeds and the console has no errors

## Notes

Sample tasks live in `src/data/initialTasks.js`. Their due dates are relative to today so the Dashboard always
has upcoming work. To start over, clear the site's data in the browser (`localStorage` keys
`studyflow-tasks` and `studyflow-settings`).

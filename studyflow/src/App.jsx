import { useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import FocusPage from "./pages/FocusPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import useLocalStorage from "./hooks/useLocalStorage";
import { initialTasks } from "./data/initialTasks";
import { defaultSettings } from "./data/defaultSettings";

function newId() {
  return globalThis.crypto?.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * App owns the SHARED state (tasks + settings).
 * It stays mounted while routes change, so tasks are never lost when you move between pages,
 * and Dashboard + Tasks + Focus always read the same array - editing a task updates all of them.
 * The timer's fast-changing state is NOT here (it lives in FocusTimer).
 */
export default function App() {
  const [tasks, setTasks] = useLocalStorage("studyflow-tasks", initialTasks);
  const [storedSettings, setSettings] = useLocalStorage("studyflow-settings", defaultSettings);

  // Merge with defaults so older saved data without a new field still works.
  const settings = { ...defaultSettings, ...storedSettings };

  // All updates are immutable: spread to copy objects, map/filter to build new arrays.
  // Functional updates + useCallback([]) => stable callbacks that memo(TaskCard) can rely on.
  const addTask = useCallback((values) => {
    setTasks((current) => [...current, { id: newId(), completed: false, ...values }]);
  }, [setTasks]);

  const updateTask = useCallback((id, changes) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...changes } : task)));
  }, [setTasks]);

  const toggleTask = useCallback((id) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, [setTasks]);

  // Derived value for the header badge and tab title - not stored in state.
  const pendingCount = tasks.filter((task) => !task.completed).length;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout pendingCount={pendingCount} displayName={settings.displayName} />}>
          <Route index element={<DashboardPage tasks={tasks} settings={settings} />} />
          <Route
            path="tasks"
            element={
              <TasksPage
                tasks={tasks}
                compact={settings.compactCards}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onToggleTask={toggleTask}
              />
            }
          />
          <Route path="focus" element={<FocusPage tasks={tasks} settings={settings} />} />
          <Route path="settings" element={<SettingsPage settings={settings} onSaveSettings={setSettings} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

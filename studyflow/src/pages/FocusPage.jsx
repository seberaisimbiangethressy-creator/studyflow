import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import Button from "../components/Button";
import FocusTimer from "../components/FocusTimer";
import SectionCard from "../components/SectionCard";
import { filterAndSortTasks } from "../utils/tasks";
import { formatDate } from "../utils/dates";

export default function FocusPage({ tasks, settings }) {
  const [mode, setMode] = useState("study"); // "study" | "break"
  const [sessionsDone, setSessionsDone] = useState(0);

  const minutes = mode === "study" ? settings.studyMinutes : settings.breakMinutes;
  const upNext = filterAndSortTasks(tasks, { status: "pending", sort: "due-asc" }).slice(0, 3);

  // Only study sessions count. useCallback keeps the identity stable for FocusTimer's Effect.
  const handleComplete = useCallback(() => {
    if (mode === "study") setSessionsDone((n) => n + 1);
  }, [mode]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Focus</h1>
        <p className="mt-1 text-slate-600">Work in one block, then rest. Pick a session and press start.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SectionCard className="md:col-span-2">
          <div role="group" aria-label="Session type" className="mb-6 flex justify-center gap-2">
            <Button
              variant={mode === "study" ? "primary" : "secondary"}
              aria-pressed={mode === "study"}
              onClick={() => setMode("study")}
            >
              Study ({settings.studyMinutes} min)
            </Button>
            <Button
              variant={mode === "break" ? "primary" : "secondary"}
              aria-pressed={mode === "break"}
              onClick={() => setMode("break")}
            >
              Break ({settings.breakMinutes} min)
            </Button>
          </div>

          {/*
            key={mode}: when the session type changes React sees a different key, throws the old
            timer away and mounts a new one - so the countdown resets automatically.
          */}
          <FocusTimer
            key={mode}
            label={mode === "study" ? "Study" : "Break"}
            minutes={minutes}
            onComplete={handleComplete}
          />

          <p className="mt-6 text-center text-xs text-slate-600">
            Tip: switching between Study and Break gives you a fresh timer on purpose.
          </p>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Today's sessions">
            <p className="text-4xl font-bold text-navy">{sessionsDone}</p>
            <p className="mt-1 text-sm text-slate-600">study {sessionsDone === 1 ? "session" : "sessions"} completed</p>
          </SectionCard>

          <SectionCard title="Up next">
            {upNext.length === 0 ? (
              <p className="text-sm text-slate-600">No pending tasks. Enjoy the free time!</p>
            ) : (
              <ul className="space-y-3">
                {upNext.map((task) => (
                  <li key={task.id} className="text-sm">
                    <p className="break-words font-medium text-navy">{task.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-slate-600">
                      Due {formatDate(task.dueDate)} <Badge tone={task.priority}>{task.priority}</Badge>
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/tasks" className="mt-4 inline-block text-sm font-semibold text-accent underline-offset-2 hover:underline">
              Manage tasks
            </Link>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

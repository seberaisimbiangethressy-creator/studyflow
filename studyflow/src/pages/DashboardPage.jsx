import { Link } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import SectionCard from "../components/SectionCard";
import ProgressBar from "../components/ProgressBar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { getTaskStats, filterAndSortTasks, isOverdue } from "../utils/tasks";
import { formatDate } from "../utils/dates";

export default function DashboardPage({ tasks, settings }) {
  // Everything below is DERIVED from `tasks` during render - no duplicate state, no Effects.
  const stats = getTaskStats(tasks);
  const upcoming = filterAndSortTasks(tasks, { status: "pending", sort: "due-asc" }).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Welcome back, {settings.displayName}!</h1>
        <p className="mt-1 text-slate-600">
          {stats.pending === 0
            ? "You're all caught up. Add a new task or enjoy a break."
            : `You have ${stats.pending} ${stats.pending === 1 ? "task" : "tasks"} left to finish.`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total tasks" value={stats.total} hint="All tasks you have added" />
        <SummaryCard label="Completed" value={stats.completed} tone="success" hint="Nice work" />
        <SummaryCard label="Pending" value={stats.pending} tone="info" hint="Still to do" />
        <SummaryCard label="Overdue" value={stats.overdue} tone="danger" hint="Past their due date" />
      </div>

      <SectionCard title="Overall progress">
        <div className="mb-2 flex justify-between text-sm text-slate-700">
          <span>
            {stats.completed} of {stats.total} tasks done
          </span>
          <span className="font-semibold">{stats.percent}%</span>
        </div>
        <ProgressBar value={stats.percent} label="Overall task completion" />
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SectionCard
          title="Upcoming tasks"
          className="md:col-span-2"
          action={
            <Link to="/tasks" className="text-sm font-semibold text-accent underline-offset-2 hover:underline">
              View all tasks
            </Link>
          }
        >
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-600">
              Nothing pending. <Link to="/tasks" className="font-semibold text-accent underline">Add a task</Link> to
              plan your next study session.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {upcoming.map((task) => (
                <li key={task.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="break-words font-medium text-navy">{task.title}</p>
                    <p className="text-sm text-slate-600">
                      {task.category} · Due {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isOverdue(task) && <Badge tone="overdue">Overdue</Badge>}
                    <Badge tone={task.priority}>{task.priority}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Focus timer">
          <p className="text-4xl font-bold tabular-nums text-navy">{String(settings.studyMinutes).padStart(2, "0")}:00</p>
          <p className="mt-1 text-sm text-slate-600">Your preferred study session, ready when you are.</p>
          <Link to="/focus" className="mt-4 block">
            <Button className="w-full" tabIndex={-1}>
              Start focusing
            </Button>
          </Link>
        </SectionCard>
      </div>
    </div>
  );
}

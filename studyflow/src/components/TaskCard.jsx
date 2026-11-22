import { memo } from "react";
import Badge from "./Badge";
import Button from "./Button";
import { formatDate } from "../utils/dates";
import { isOverdue } from "../utils/tasks";

/**
 * One task. Wrapped in memo(): TasksPage re-renders on every keystroke in the search box,
 * but a TaskCard only re-renders when ITS props change. That works because
 *  - App updates tasks immutably (unchanged tasks keep the same object), and
 *  - the callbacks come from useCallback, so their identity is stable.
 */
function TaskCard({ task, compact, onToggle, onEdit, onDelete }) {
  // Development-only log used to observe re-renders (see README, "Rendering").
  if (import.meta.env.DEV) console.log(`[render] TaskCard ${task.id}`);

  const overdue = isOverdue(task);

  return (
    <li
      className={`rounded-xl border bg-white shadow-sm ${compact ? "p-3" : "p-5"} ${
        overdue ? "border-red-300" : "border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.completed ? "not done" : "done"}`}
          className="mt-1 h-5 w-5 shrink-0 accent-teal-700"
        />
        <div className="min-w-0 flex-1">
          <h3
            className={`break-words font-semibold ${
              task.completed ? "text-slate-500 line-through" : "text-navy"
            }`}
          >
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {task.category} · Due {formatDate(task.dueDate)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={task.priority}>{task.priority} priority</Badge>
            {task.completed ? (
              <Badge tone="completed">Completed</Badge>
            ) : overdue ? (
              <Badge tone="overdue">Overdue</Badge>
            ) : (
              !compact && <Badge tone="pending">Pending</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 pl-8">
        <Button size="sm" variant="secondary" onClick={() => onEdit(task)} aria-label={`Edit "${task.title}"`}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(task)} aria-label={`Delete "${task.title}"`}>
          Delete
        </Button>
      </div>
    </li>
  );
}

export default memo(TaskCard);

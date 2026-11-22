import { todayString } from "./dates";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function isOverdue(task) {
  return !task.completed && task.dueDate !== "" && task.dueDate < todayString();
}

/** Every dashboard number is derived from the tasks array - nothing is stored twice. */
export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter(isOverdue).length;
  return {
    total,
    completed,
    pending: total - completed,
    overdue,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

/** Search + category + status filters and the sort order, all applied together. */
export function filterAndSortTasks(tasks, { search = "", category = "all", status = "all", sort = "due-asc" }) {
  const query = search.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    if (query && !task.title.toLowerCase().includes(query)) return false;
    if (category !== "all" && task.category !== category) return false;
    if (status === "pending" && task.completed) return false;
    if (status === "completed" && !task.completed) return false;
    if (status === "overdue" && !isOverdue(task)) return false;
    return true;
  });

  // [...filtered] copy so we never mutate the array we were given.
  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "due-desc":
        return b.dueDate.localeCompare(a.dueDate);
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "priority":
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      case "due-asc":
      default:
        return a.dueDate.localeCompare(b.dueDate);
    }
  });
}

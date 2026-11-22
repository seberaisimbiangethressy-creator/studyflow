import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import TaskForm from "../components/TaskForm";
import useDebounce from "../hooks/useDebounce";
import useToggle from "../hooks/useToggle";
import { filterAndSortTasks } from "../utils/tasks";

/**
 * TasksPage owns only UI state (filters, which form is open).
 * The tasks themselves belong to App; this page receives them and callback props.
 */
export default function TasksPage({ tasks, compact, onAddTask, onUpdateTask, onDeleteTask, onToggleTask }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("due-asc");
  const [showForm, , setShowForm] = useToggle(false);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");
  const searchRef = useRef(null);

  // The list filters on the debounced text, so typing stays smooth.
  const debouncedSearch = useDebounce(search, 250);

  // Derived from props + filter state. useMemo is justified: it skips re-sorting the list
  // when the page re-renders for an unrelated reason (e.g. opening the form).
  const visibleTasks = useMemo(
    () => filterAndSortTasks(tasks, { search: debouncedSearch, category, status, sort }),
    [tasks, debouncedSearch, category, status, sort]
  );

  // Derived: if the edited task was deleted meanwhile, we simply fall back to "add" mode.
  const editingTask = editingId ? tasks.find((t) => t.id === editingId) ?? null : null;

  // Auto-hide the success message. The cleanup cancels the timer if the page unmounts first.
  useEffect(() => {
    if (!notice) return;
    const timeoutId = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [notice]);

  // Stable callbacks (useCallback) let memo(TaskCard) skip unnecessary re-renders.
  const handleEdit = useCallback(
    (task) => {
      setEditingId(task.id);
      setShowForm(true);
    },
    [setShowForm]
  );

  const handleDelete = useCallback(
    (task) => {
      if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
        onDeleteTask(task.id);
        setNotice("Task deleted.");
      }
    },
    [onDeleteTask]
  );

  function openAddForm() {
    setEditingId(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleSubmit(values) {
    if (editingTask) {
      onUpdateTask(editingTask.id, values);
      setNotice("Task updated.");
    } else {
      onAddTask(values);
      setNotice("Task added.");
    }
    closeForm();
  }

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setStatus("all");
    searchRef.current?.focus(); // ref in action: put the cursor back in the search box
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-navy">Tasks</h1>
          <p className="mt-1 text-slate-600">Add, search and organise everything you need to study.</p>
        </div>
        <Button onClick={openAddForm}>+ Add task</Button>
      </div>

      {notice && (
        <p role="status" className="rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
          {notice}
        </p>
      )}

      {showForm && (
        <TaskForm
          key={editingTask ? editingTask.id : "new"}
          initialTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      <TaskFilters
        search={search}
        category={category}
        status={status}
        sort={sort}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onClear={clearFilters}
        searchRef={searchRef}
        shown={visibleTasks.length}
        total={tasks.length}
      />

      {tasks.length === 0 ? (
        <EmptyState title="No tasks yet" message="Your list is empty. Add your first study task to get started.">
          <Button onClick={openAddForm}>Add your first task</Button>
        </EmptyState>
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          title="No matching tasks"
          message="Nothing matches your search and filters. Try different words or clear the filters."
        >
          <Button variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              compact={compact}
              onToggle={onToggleTask}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

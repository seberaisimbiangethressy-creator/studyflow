import Button from "./Button";
import SelectField from "./SelectField";
import TextField from "./TextField";
import { categories } from "../data/categories";

/**
 * Search, filter and sort controls. It owns no state: the values and the
 * change handlers come from TasksPage (props + callback props).
 * `searchRef` is passed down as a normal prop and lands on the real <input>.
 */
export default function TaskFilters({
  search,
  category,
  status,
  sort,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onClear,
  searchRef,
  shown,
  total,
}) {
  const hasFilters = search !== "" || category !== "all" || status !== "all";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <TextField
          ref={searchRef}
          label="Search by title"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
        />
        <SelectField label="Category" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
        <SelectField label="Status" value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </SelectField>
        <SelectField label="Sort by" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="due-asc">Due date (soonest)</option>
          <option value="due-desc">Due date (latest)</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
          <option value="priority">Priority</option>
        </SelectField>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600" aria-live="polite">
          Showing {shown} of {total} {total === 1 ? "task" : "tasks"}
        </p>
        {hasFilters && (
          <Button size="sm" variant="ghost" onClick={onClear}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

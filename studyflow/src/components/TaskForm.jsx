import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import SelectField from "./SelectField";
import TextField from "./TextField";
import SectionCard from "./SectionCard";
import { categories } from "../data/categories";
import { todayString } from "../utils/dates";

const emptyTask = () => ({
  title: "",
  category: categories[0],
  dueDate: todayString(),
  priority: "medium",
});

function validate(values) {
  const errors = {};
  if (values.title.trim() === "") errors.title = "Please enter a task title.";
  else if (values.title.trim().length > 80) errors.title = "Keep the title under 80 characters.";
  if (values.dueDate === "") errors.dueDate = "Please choose a due date.";
  return errors;
}

/**
 * Controlled form used for both Add and Edit.
 * `initialTask` is null when adding. The parent gives this component a `key`
 * so switching between tasks remounts it with fresh values.
 */
export default function TaskForm({ initialTask, onSubmit, onCancel }) {
  const isEditing = Boolean(initialTask);
  const [values, setValues] = useState(() =>
    initialTask
      ? { title: initialTask.title, category: initialTask.category, dueDate: initialTask.dueDate, priority: initialTask.priority }
      : emptyTask()
  );
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);
  const dateRef = useRef(null);

  // Real UI need: put the cursor in the title box as soon as the form opens.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value })); // new object, never mutate
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Send the keyboard user to the first field that needs fixing.
      (found.title ? titleRef : dateRef).current?.focus();
      return;
    }
    onSubmit({ ...values, title: values.title.trim() });
  }

  return (
    <SectionCard title={isEditing ? "Edit task" : "Add a new task"}>
      <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        <TextField
          ref={titleRef}
          label="Title"
          name="title"
          value={values.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. Revise chapter 4"
          className="sm:col-span-2"
        />
        <SelectField label="Category" name="category" value={values.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </SelectField>
        <SelectField label="Priority" name="priority" value={values.priority} onChange={handleChange}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </SelectField>
        <TextField
          ref={dateRef}
          label="Due date"
          name="dueDate"
          type="date"
          value={values.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />
        <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
          <Button type="submit">{isEditing ? "Save changes" : "Add task"}</Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

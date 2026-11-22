import { addDays } from "../utils/dates";

// Sample tasks shown the first time the site is opened.
// Due dates are relative to today so the Dashboard always has "upcoming" work.
export const initialTasks = [
  { id: "t1", title: "Revise calculus derivatives", category: "Math", dueDate: addDays(1), priority: "high", completed: false },
  { id: "t2", title: "Write chemistry lab report", category: "Science", dueDate: addDays(3), priority: "high", completed: false },
  { id: "t3", title: "Practise 20 Spanish verbs", category: "Languages", dueDate: addDays(2), priority: "medium", completed: false },
  { id: "t4", title: "Finish React Router exercises", category: "Coding", dueDate: addDays(5), priority: "medium", completed: true },
  { id: "t5", title: "Read chapter 7: Industrial Revolution", category: "History", dueDate: addDays(7), priority: "low", completed: false },
  { id: "t6", title: "Organise lecture notes", category: "Other", dueDate: addDays(-1), priority: "low", completed: false },
];

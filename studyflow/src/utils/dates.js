// Small date helpers. Dates are stored as "YYYY-MM-DD" strings so they sort
// correctly as plain text and work directly with <input type="date">.

const pad = (n) => String(n).padStart(2, "0");

export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayString() {
  return toDateString(new Date());
}

export function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function formatDate(dateString) {
  if (!dateString) return "No due date";
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

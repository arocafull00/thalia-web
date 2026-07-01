function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatLocalDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatLocalDatetimeInputValue(date: Date) {
  return `${formatLocalDateInputValue(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalDateInputValue(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function parseLocalDatetimeInputValue(value: string) {
  return new Date(value);
}

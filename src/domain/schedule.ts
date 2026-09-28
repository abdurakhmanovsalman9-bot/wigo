const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

/** Turns labels like «Суббота · 19:30» or «Сегодня · 19:30» into the nearest future date. */
export function labelToDate(label: string, now = new Date()): Date | null {
  const [day, time] = label.split(' · ');
  const [hours, minutes] = (time ?? '').split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  const date = new Date(now);
  date.setHours(hours, minutes, 0, 0);
  if (day === 'Сегодня') return date;
  const target = weekdays.indexOf(day);
  if (target < 0) return null;
  let shift = (target - now.getDay() + 7) % 7;
  if (shift === 0 && date <= now) shift = 7;
  date.setDate(date.getDate() + shift);
  return date;
}

export function dateToLabel(value: string | null, now = new Date()): string {
  if (!value) return 'Время не указано';
  const date = new Date(value);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const today = date.toDateString() === now.toDateString();
  return `${today ? 'Сегодня' : weekdays[date.getDay()]} · ${time}`;
}

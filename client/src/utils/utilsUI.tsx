export const getLocalDateTimeInput = (date: Date | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: Date | string | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const sameYMD = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const formatDayHeader = (
  date: Date,
): { name: string; date: string } => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (sameYMD(date, today)) {
    return {
      name: 'Today',
      date: date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
      }),
    };
  }
  if (sameYMD(date, yesterday)) {
    return {
      name: 'Yesterday',
      date: date.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
      }),
    };
  }
  const sameYear = date.getFullYear() === today.getFullYear();
  return {
    name: date.toLocaleDateString(undefined, { weekday: 'long' }),
    date: date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      ...(sameYear ? {} : { year: 'numeric' }),
    }),
  };
};

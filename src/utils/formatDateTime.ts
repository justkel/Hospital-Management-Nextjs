export function formatDateTime(
  date: string | Date,
  options?: {
    showTime?: boolean;
    shortMonth?: boolean;
  }
) {
  const parsedDate = new Date(date);

  const { showTime = true, shortMonth = true } = options || {};

  return parsedDate.toLocaleString('en-NG', {
    day: 'numeric',
    month: shortMonth ? 'short' : 'long',
    year: 'numeric',
    ...(showTime && {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  });
}
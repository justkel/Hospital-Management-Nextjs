const PALETTE = [
  { bg: 'bg-amber-100', text: 'text-amber-900' },
  { bg: 'bg-rose-100', text: 'text-rose-900' },
  { bg: 'bg-sky-100', text: 'text-sky-900' },
  { bg: 'bg-lime-100', text: 'text-lime-900' },
  { bg: 'bg-violet-100', text: 'text-violet-900' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function paletteForNote(id: string) {
  return PALETTE[hashString(id) % PALETTE.length];
}

export function rotationForNote(id: string): number {
  return (hashString(id) % 11) - 5;
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return 'just now';

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(iso).toLocaleDateString();
}
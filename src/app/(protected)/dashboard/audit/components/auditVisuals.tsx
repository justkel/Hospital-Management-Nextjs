const PALETTE = [
  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
  { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' },
] as const;

const KNOWN_ACTION_COLORS: Record<string, number> = {
  CREATE: 0,
  CREATED: 0,
  INSERT: 0,
  RESTORED: 0,
  COMPLETED: 0,
  UPDATE: 1,
  UPDATED: 1,
  EDIT: 1,
  RECORDED: 1,
  REALLOCATED: 2,
  DELETE: 4,
  DELETED: 4,
  REMOVE: 4,
  CANCELLED: 4,
  ABORTED: 4,
  LOGIN: 5,
  SYNC: 5,
  SYNCED: 5,
  LOGOUT: 6,
  VIEW: 6,
  READ: 6,
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getActionStyle(action?: string | null) {
  if (!action) return PALETTE[PALETTE.length - 1];
  const key = action.toUpperCase();
  const index = KNOWN_ACTION_COLORS[key] ?? hashString(key) % PALETTE.length;
  return PALETTE[index];
}

export function getInitials(name?: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : '';
  return (first + last).toUpperCase() || '?';
}

export function formatAbsolute(date: string) {
  const d = new Date(date);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatRelative(date: string) {
  const then = new Date(date).getTime();
  const now = Date.now();
  const diffSeconds = Math.round((now - then) / 1000);

  if (diffSeconds < 60) return 'Just now';
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatAbsolute(date);
}
export function Meta({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold truncate">{value}</p>
    </div>
  );
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
      {initials}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-40 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-24 bg-gray-200 rounded-xl" />
    </div>
  );
}

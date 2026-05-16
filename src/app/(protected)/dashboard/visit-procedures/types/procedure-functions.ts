export function formatDuration(minutes?: number | null) {
    if (!minutes) return null;

    if (minutes < 60) {
        return `${minutes} min${minutes === 1 ? '' : 's'}`;
    }

    const hours = minutes / 60;
    const formattedHours =
        hours % 1 === 0 ? hours : Number(hours.toFixed(1));

    return `${formattedHours} hour${formattedHours === 1 ? '' : 's'
        }`;
}
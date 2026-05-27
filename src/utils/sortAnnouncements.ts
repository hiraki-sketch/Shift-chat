type SortableAnnouncement = {
  pinned?: boolean;
  createdAt: string;
};

function toTimestamp(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

export function sortAnnouncements<T extends SortableAnnouncement>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const pinnedA = Boolean(a.pinned);
    const pinnedB = Boolean(b.pinned);

    if (pinnedA !== pinnedB) {
      return pinnedA ? -1 : 1;
    }

    return toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
  });
}

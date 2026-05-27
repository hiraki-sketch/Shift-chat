import { sortAnnouncements } from "../src/utils/sortAnnouncements";

describe("sortAnnouncements", () => {
  it("sorts pinned first, then createdAt desc", () => {
    const input = [
      { id: "a", pinned: false, createdAt: "2026-05-01T10:00:00.000Z" },
      { id: "b", pinned: true, createdAt: "2026-05-01T08:00:00.000Z" },
      { id: "c", pinned: true, createdAt: "2026-05-01T12:00:00.000Z" },
      { id: "d", pinned: false, createdAt: "2026-05-01T11:00:00.000Z" },
    ];

    const result = sortAnnouncements(input);
    expect(result.map((x) => x.id)).toEqual(["c", "b", "d", "a"]);
  });
});

import { describe, expect, it } from "vitest";
import { CollectionIncludingMembersAndLinkCount } from "@linkwarden/types/global";
import { buildTreeFromCollections } from "./buildTreeFromCollections";

const makeCollection = (
  id: number,
  name: string,
  parentId: number | null,
  links: number
) =>
  ({
    id,
    name,
    parentId,
    description: "",
    color: "#0ea5e9",
    icon: null,
    iconWeight: null,
    isPublic: false,
    ownerId: 1,
    createdAt: new Date("2026-05-08T00:00:00.000Z"),
    updatedAt: new Date("2026-05-08T00:00:00.000Z"),
    _count: { links },
    members: [],
  }) as unknown as CollectionIncludingMembersAndLinkCount;

describe("buildTreeFromCollections", () => {
  it("keeps each collection's direct link count instead of summing descendants", () => {
    const tree = buildTreeFromCollections(
      [
        makeCollection(1, "Parent", null, 0),
        makeCollection(2, "Child", 1, 0),
        makeCollection(3, "Grandchild", 2, 1),
      ],
      { asPath: "/collections/3" }
    );

    expect((tree.items[1].data as any)._count.links).toBe(0);
    expect((tree.items[2].data as any)._count.links).toBe(0);
    expect((tree.items[3].data as any)._count.links).toBe(1);
    expect(tree.items[1].isExpanded).toBe(true);
    expect(tree.items[2].isExpanded).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { buildTreeFromCollections } from "./CollectionListing";

const router = { asPath: "/collections" } as any;

const collection = (
  id: number,
  name: string,
  links: number,
  parentId: number | null = null
) =>
  ({
    id,
    name,
    parentId,
    description: "",
    color: "#000000",
    icon: null,
    iconWeight: null,
    isPublic: false,
    ownerId: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    _count: { links },
  }) as any;

describe("buildTreeFromCollections", () => {
  it("counts only direct child collection links", () => {
    const tree = buildTreeFromCollections(
      [
        collection(1, "Parent", 1),
        collection(2, "Child", 2, 1),
        collection(3, "Grandchild", 3, 2),
      ],
      router
    );

    expect((tree.items[1].data as any)._count.links).toBe(3);
    expect((tree.items[2].data as any)._count.links).toBe(5);
    expect((tree.items[3].data as any)._count.links).toBe(3);
  });
});

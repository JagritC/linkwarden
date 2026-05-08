import { Collection } from "@linkwarden/prisma/client";
import { CollectionIncludingMembersAndLinkCount } from "@linkwarden/types/global";
import { TreeData, TreeItem } from "@atlaskit/tree";

export interface ExtendedTreeItem extends TreeItem {
  data: Collection;
}

type RouterLike = {
  asPath: string;
};

export const buildTreeFromCollections = (
  collections: CollectionIncludingMembersAndLinkCount[],
  router: RouterLike,
  tree?: TreeData,
  order?: number[]
): TreeData => {
  if (order) {
    collections.sort((a: any, b: any) => {
      return order.indexOf(a.id) - order.indexOf(b.id);
    });
  }

  const items: { [key: string]: ExtendedTreeItem } = collections.reduce(
    (acc: any, collection) => {
      acc[collection.id as number] = {
        id: collection.id,
        children: [],
        hasChildren: false,
        isExpanded: tree?.items[collection.id as number]?.isExpanded || false,
        data: {
          id: collection.id,
          parentId: collection.parentId,
          name: collection.name,
          description: collection.description,
          color: collection.color,
          icon: collection.icon,
          iconWeight: collection.iconWeight,
          isPublic: collection.isPublic,
          ownerId: collection.ownerId,
          createdAt: collection.createdAt,
          updatedAt: collection.updatedAt,
          _count: {
            links: collection._count?.links,
          },
        },
      };
      return acc;
    },
    {}
  );

  const activeCollectionId = Number(router.asPath.split("/collections/")[1]);

  if (activeCollectionId) {
    for (const item in items) {
      const collection = items[item];
      if (Number(item) === activeCollectionId && collection.data.parentId) {
        let parentId = collection.data.parentId || null;
        while (parentId && items[parentId]) {
          items[parentId].isExpanded = true;
          parentId = items[parentId].data.parentId;
        }
      }
    }
  }

  collections.forEach((collection) => {
    const parentId = collection.parentId;
    if (parentId && items[parentId] && collection.id) {
      items[parentId].children.push(collection.id);
      items[parentId].hasChildren = true;
    }
  });

  const rootId = "root";
  items[rootId] = {
    id: rootId,
    children: (collections
      .filter(
        (c) =>
          c.parentId === null || !collections.find((i) => i.id === c.parentId)
      )
      .map((c) => c.id) || "") as unknown as string[],
    hasChildren: true,
    isExpanded: true,
    data: { name: "Root" } as Collection,
  };

  return { rootId, items };
};

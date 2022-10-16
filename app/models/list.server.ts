import type { List } from "@prisma/client";
import { prisma } from "~/db.server";
export type { List } from "@prisma/client";

export function addList({ name, gifts }: Pick<List, "name" | "gifts">) {
  return prisma.list.create({
    data: {
      name,
      gifts,
    },
  });
}
export function getLists() {
  return prisma.list.findMany();
}

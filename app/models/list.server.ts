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
export function getList({ id }: Pick<List, "id">) {
  return prisma.list.findFirst({
    select: { id: true, gifts: true, name: true },
    where: { id },
  });
}
export function getLists() {
  return prisma.list.findMany();
}
export function deleteList({ id }: Pick<List, "id">) {
  return prisma.list.delete({
    where: { id },
  });
}
export function updateList({ id, gifts }: Pick<List, "id" | "gifts">) {
  return prisma.list.update({
    where: { id },
    data: {
      gifts,
    },
  });
}

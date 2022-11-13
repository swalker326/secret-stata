import { prisma } from "~/db.server";

export async function getAllLists() {
  return prisma.list.findMany();
}

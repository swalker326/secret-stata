export {};
// import type { Person } from "@prisma/client";
// import { prisma } from "~/db.server";
// export type { Person } from "@prisma/client";

// export function getPersonDetails({ id }: Pick<Person, "id">) {
//   return prisma.person.findFirst({
//     where: { id },
//     select: { id: true, name: true, list: true, santa: true },
//     orderBy: { updatedAt: "desc" },
//   });
// }
// export function getAllLists() {
//   return prisma.person.findMany({
//     select: { id: true, name: true, list: true },
//     orderBy: { updatedAt: "desc" },
//   });
// }
// export function deleteList({ id }: Pick<Person, "id">) {
//   return prisma.person.update({ where: { id }, data: { list: [] } });
// }
// export function updateList({ id, list }: Pick<Person, "id" | "list">) {
//   return prisma.person.update({ where: { id }, data: { list } });
// }
// export function getPersonByName({ name }: Pick<Person, "name">) {
//   return prisma.person.findFirst({
//     where: { name },
//     select: { id: true, name: true, list: true },
//   });
// }
// export function getPeopleWithoutList() {
//   console.log("getPeopleWithoutList");
//   return prisma.person.findMany({
//     where: { list: { equals: [] } },
//     select: { id: true, name: true, listSubmitted: true },
//     orderBy: { updatedAt: "desc" },
//   });
// }
// export function updatePersonList({ id, list }: Pick<Person, "id" | "list">) {
//   console.log("list :", list); //eslint disable line ##DEBUG
//   return prisma.person.update({
//     where: { id },
//     data: { list },
//   });
// }

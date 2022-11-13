import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id }, include: { gifts: true } });
}
export async function getUsers() {
  return prisma.user.findMany({
    select: { gifts: true, santaId: true, name: true, id: true },
  });
}

export function getUsersWithoutGifts() {
  return prisma.user.findMany({
    where: { gifts: { items: { equals: [] } } },
    select: { id: true, name: true, gifts: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function updateUserGifts({
  id,
  gifts,
}: {
  id: User["id"];
  gifts: string[];
}) {
  return prisma.user.update({
    where: { id },
    data: {
      listSubmitted: true,
      gifts: {
        upsert: {
          create: {
            name: "list",
            items: gifts,
          },
          update: {
            items: gifts,
          },
        },
      },
    },
  });
}

export async function getUserByName(name: User["name"]) {
  return prisma.user.findUnique({ where: { name }, include: { gifts: true } });
}

export async function setUserSanta(
  name: User["name"],
  santaId: User["id"]
): Promise<User> {
  return prisma.user.update({
    where: { name },
    data: { santaId },
  });
}

export async function createUser(name: User["name"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByname(name: User["name"]) {
  return prisma.user.delete({ where: { name } });
}

export async function verifyLogin(
  name: User["name"],
  password: Password["hash"]
) {
  console.log("name :", name); //eslint disable line ##DEBUG
  console.log("password :", password); //eslint disable line ##DEBUG
  const userWithPassword = await prisma.user.findUnique({
    where: { name },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

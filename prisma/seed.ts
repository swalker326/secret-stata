import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getUsers } from "~/models/user.server";

const prisma = new PrismaClient();

async function seed() {
  const generatePassword = (name: string) => {
    const password = `${name}123`;
    return bcrypt.hash(password, 10);
  };
  const name = "shane@swalker.dev";
  const admin = "admin@swalker.dev";
  const hashedAdminPassword = await bcrypt.hash("adminadmin1!", 10);
  const users = await [
    { name: "Anthony", password: await generatePassword("Anthony") },
    { name: "Bobe", password: await generatePassword("Bobe") },
    { name: "David", password: await generatePassword("David") },
    { name: "Jack", password: await generatePassword("Jack") },
    { name: "Jen", password: await generatePassword("Jen") },
    { name: "Jill", password: await generatePassword("Jill") },
    { name: "Joanie", password: await generatePassword("Joanie") },
    { name: "Jon", password: await generatePassword("Jon") },
    { name: "Jori", password: await generatePassword("Jori") },
    { name: "Katie", password: await generatePassword("Katie") },
    { name: "Liz", password: await generatePassword("Liz") },
    { name: "Marcy", password: await generatePassword("Marcy") },
    { name: "Mark", password: await generatePassword("Mark") },
    { name: "Nancy", password: await generatePassword("Nancy") },
    { name: "Shane", password: await generatePassword("Shane") },
    { name: "Shon", password: await generatePassword("Shon") },
  ];
  // cleanup the existing database
  await prisma.user.delete({ where: { name } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  // const hashedPassword = await bcrypt.hash("christmas2022yay", 10);
  const generateSantas = () => {
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    return shuffledUsers.map((user, index) => ({
      ...user,
      santa: users[index + 1]?.name || users[0]?.name,
    }));
  };
  const usersWithSantas = generateSantas();

  for (let user of users) {
    await prisma.user.create({
      data: {
        name: user.name,
        password: {
          create: {
            hash: await user.password,
          },
        },
      },
    });
  }
  await prisma.user.create({
    data: {
      name: admin,
      password: {
        create: {
          hash: hashedAdminPassword,
        },
      },
    },
  });

  // Set the santa for each user
  await Promise.all(
    usersWithSantas.map(async ({ name, santa }) => {
      const santaUser = await prisma.user.findUnique({
        where: { name: santa },
      });
      const user = await prisma.user.findUnique({ where: { name } });
      try {
        await prisma.user.update({
          where: { name },
          data: {
            santaId: santaUser?.id,
          },
        });
        await prisma.user.update({
          where: { name: santa },
          data: {
            recipientId: user?.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    })
  );
  getUsers().then((users) => {
    Promise.all(
      users.map((user) => {
        const recipient = users.find((u) => u.id === user.santaId);
        console.log(`${user.name} is buying for ${recipient?.name}`);
        prisma.user.update({
          where: { id: user.id },
          data: { recipientId: recipient?.id },
        });
      })
    );
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

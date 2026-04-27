import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Pulizia
  await prisma.workLog.deleteMany();
  await prisma.site.deleteMany();
  await prisma.user.deleteMany();

  // Utenti
  const adminPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@construction.com",
      password: adminPassword,
      firstName: "Marco",
      lastName: "Bianchi",
      role: "ADMIN",
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@construction.com",
      password: await bcrypt.hash("password123", 12),
      firstName: "Luigi",
      lastName: "Ferrari",
      role: "SITE_MANAGER",
    },
  });

  const worker1 = await prisma.user.create({
    data: {
      email: "mario@construction.com",
      password: await bcrypt.hash("password123", 12),
      firstName: "Mario",
      lastName: "Rossi",
      role: "WORKER",
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      email: "giuseppe@construction.com",
      password: await bcrypt.hash("password123", 12),
      firstName: "Giuseppe",
      lastName: "Verdi",
      role: "WORKER",
    },
  });

  console.log("✅ Utenti creati");

  // Cantieri
  const site1 = await prisma.site.create({
    data: {
      name: "Cantiere Via Roma",
      address: "Via Roma 1",
      city: "Milano",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      managerId: manager.id,
      workers: {
        connect: [{ id: worker1.id }, { id: worker2.id }],
      },
    },
  });

  const site2 = await prisma.site.create({
    data: {
      name: "Cantiere Piazza Duomo",
      address: "Piazza Duomo 5",
      city: "Firenze",
      startDate: new Date("2026-03-01"),
      managerId: manager.id,
      workers: {
        connect: [{ id: worker1.id }],
      },
    },
  });

  console.log("✅ Cantieri creati");

  // WorkLogs
  await prisma.workLog.createMany({
    data: [
      {
        date: new Date("2026-04-01"),
        hoursWorked: 8,
        notes: "Scavi fondamenta",
        status: "APPROVED",
        workerId: worker1.id,
        siteId: site1.id,
      },
      {
        date: new Date("2026-04-02"),
        hoursWorked: 7.5,
        notes: "Getto calcestruzzo",
        status: "APPROVED",
        workerId: worker1.id,
        siteId: site1.id,
      },
      {
        date: new Date("2026-04-01"),
        hoursWorked: 8,
        notes: "Installazione ponteggi",
        status: "PENDING",
        workerId: worker2.id,
        siteId: site1.id,
      },
      {
        date: new Date("2026-04-03"),
        hoursWorked: 6,
        notes: "Muratura perimetrale",
        status: "PENDING",
        workerId: worker1.id,
        siteId: site2.id,
      },
    ],
  });

  console.log("✅ WorkLogs creati");
  console.log("\n🎉 Seed completato!");
  console.log("\nCredenziali di accesso:");
  console.log("  Admin:   admin@construction.com / password123");
  console.log("  Manager: manager@construction.com / password123");
  console.log("  Worker:  mario@construction.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
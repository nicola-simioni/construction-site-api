import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import type { CreateWorkerInput, UpdateWorkerInput } from "./workers.schema";

const workerSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  createdAt: true,
};

export class WorkersService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { role: "WORKER" },
      select: workerSelect,
    });
  }

  async findOne(id: number) {
    const worker = await this.prisma.user.findFirst({
      where: { id, role: "WORKER" },
      select: {
        ...workerSelect,
        workerSites: {
          select: { id: true, name: true, city: true, isActive: true },
        },
      },
    });

    if (!worker) throw new Error("WORKER_NOT_FOUND");
    return worker;
  }

  async create(input: CreateWorkerInput) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) throw new Error("EMAIL_TAKEN");

    const hashedPassword = await bcrypt.hash(input.password, 12);

    return this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        role: "WORKER",
      },
      select: workerSelect,
    });
  }

  async update(id: number, input: UpdateWorkerInput) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: input,
      select: workerSelect,
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
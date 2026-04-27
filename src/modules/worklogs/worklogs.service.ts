import type { PrismaClient } from "@prisma/client";
import type { CreateWorkLogInput, UpdateWorkLogInput } from "./worklogs.schema";

export class WorkLogsService {
  constructor(private prisma: PrismaClient) {}

  async findAll(siteId?: number, workerId?: number) {
    return this.prisma.workLog.findMany({
      where: {
        ...(siteId && { siteId }),
        ...(workerId && { workerId }),
      },
      include: {
        worker: {
          select: { id: true, firstName: true, lastName: true },
        },
        site: {
          select: { id: true, name: true, city: true },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  async findOne(id: number) {
    const log = await this.prisma.workLog.findUnique({
      where: { id },
      include: {
        worker: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        site: {
          select: { id: true, name: true, city: true },
        },
      },
    });

    if (!log) throw new Error("WORKLOG_NOT_FOUND");
    return log;
  }

  async create(input: CreateWorkLogInput) {
    return this.prisma.workLog.create({
      data: {
        date: new Date(input.date),
        hoursWorked: input.hoursWorked,
        notes: input.notes,
        workerId: input.workerId,
        siteId: input.siteId,
      },
    });
  }

  async updateStatus(id: number, input: UpdateWorkLogInput) {
    await this.findOne(id);
    return this.prisma.workLog.update({
      where: { id },
      data: { status: input.status },
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.workLog.delete({ where: { id } });
  }
}
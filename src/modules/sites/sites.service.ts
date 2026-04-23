import type { PrismaClient } from "@prisma/client";
import type { CreateSiteInput, UpdateSiteInput } from "./sites.schema";

export class SitesService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.site.findMany({
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        _count: { select: { workers: true, workLogs: true } },
      },
    });
  }

  async findOne(id: number) {
    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        workers: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        _count: { select: { workLogs: true } },
      },
    });

    if (!site) throw new Error("SITE_NOT_FOUND");
    return site;
  }

  async create(input: CreateSiteInput) {
    const manager = await this.prisma.user.findUnique({
      where: { id: input.managerId },
    });

    if (!manager) throw new Error("MANAGER_NOT_FOUND");

    return this.prisma.site.create({
      data: {
        name: input.name,
        address: input.address,
        city: input.city,
        startDate: new Date(input.startDate),
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        managerId: input.managerId,
      },
    });
  }

  async update(id: number, input: UpdateSiteInput) {
    await this.findOne(id);

    return this.prisma.site.update({
      where: { id },
      data: {
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      },
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.site.delete({ where: { id } });
  }

  async addWorker(siteId: number, workerId: number) {
    await this.findOne(siteId);
    return this.prisma.site.update({
      where: { id: siteId },
      data: { workers: { connect: { id: workerId } } },
    });
  }

  async removeWorker(siteId: number, workerId: number) {
    await this.findOne(siteId);
    return this.prisma.site.update({
      where: { id: siteId },
      data: { workers: { disconnect: { id: workerId } } },
    });
  }
}
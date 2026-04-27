import type { FastifyPluginAsync } from "fastify";
import { WorkLogsService } from "./worklogs.service";
import { createWorkLogSchema, updateWorkLogSchema } from "./worklogs.schema";

const workLogsRoutes: FastifyPluginAsync = async (fastify) => {
  const workLogsService = new WorkLogsService(fastify.prisma);

  fastify.get(
    "/worklogs",
    { preHandler: [fastify.authenticate] },
    async (request) => {
      const { siteId, workerId } = request.query as {
        siteId?: string;
        workerId?: string;
      };
      return workLogsService.findAll(
        siteId ? Number(siteId) : undefined,
        workerId ? Number(workerId) : undefined
      );
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/worklogs/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        return await workLogsService.findOne(Number(request.params.id));
      } catch (err: any) {
        if (err.message === "WORKLOG_NOT_FOUND") {
          return reply.status(404).send({ error: "Log non trovato" });
        }
        throw err;
      }
    }
  );

  fastify.post(
    "/worklogs",
    { preHandler: [fastify.authorize(["ADMIN", "SITE_MANAGER"])] },
    async (request, reply) => {
      const input = createWorkLogSchema.parse(request.body);
      return reply.status(201).send(await workLogsService.create(input));
    }
  );

  fastify.patch<{ Params: { id: string } }>(
    "/worklogs/:id/status",
    { preHandler: [fastify.authorize(["ADMIN", "SITE_MANAGER"])] },
    async (request, reply) => {
      const input = updateWorkLogSchema.parse(request.body);
      try {
        return await workLogsService.updateStatus(Number(request.params.id), input);
      } catch (err: any) {
        if (err.message === "WORKLOG_NOT_FOUND") {
          return reply.status(404).send({ error: "Log non trovato" });
        }
        throw err;
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/worklogs/:id",
    { preHandler: [fastify.authorize(["ADMIN"])] },
    async (request, reply) => {
      try {
        await workLogsService.delete(Number(request.params.id));
        return reply.status(204).send();
      } catch (err: any) {
        if (err.message === "WORKLOG_NOT_FOUND") {
          return reply.status(404).send({ error: "Log non trovato" });
        }
        throw err;
      }
    }
  );
};

export default workLogsRoutes;
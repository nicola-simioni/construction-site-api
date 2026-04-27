import type { FastifyPluginAsync } from "fastify";
import { WorkersService } from "./workers.service";
import { createWorkerSchema, updateWorkerSchema } from "./workers.schema";

const workersRoutes: FastifyPluginAsync = async (fastify) => {
  const workersService = new WorkersService(fastify.prisma);

  fastify.get(
    "/workers",
    { preHandler: [fastify.authorize(["ADMIN", "SITE_MANAGER"])] },
    async () => workersService.findAll()
  );

  fastify.get<{ Params: { id: string } }>(
    "/workers/:id",
    { preHandler: [fastify.authorize(["ADMIN", "SITE_MANAGER"])] },
    async (request, reply) => {
      try {
        return await workersService.findOne(Number(request.params.id));
      } catch (err: any) {
        if (err.message === "WORKER_NOT_FOUND") {
          return reply.status(404).send({ error: "Operaio non trovato" });
        }
        throw err;
      }
    }
  );

  fastify.post(
    "/workers",
    { preHandler: [fastify.authorize(["ADMIN"])] },
    async (request, reply) => {
      const input = createWorkerSchema.parse(request.body);
      try {
        return reply.status(201).send(await workersService.create(input));
      } catch (err: any) {
        if (err.message === "EMAIL_TAKEN") {
          return reply.status(409).send({ error: "Email già in uso" });
        }
        throw err;
      }
    }
  );

  fastify.patch<{ Params: { id: string } }>(
    "/workers/:id",
    { preHandler: [fastify.authorize(["ADMIN"])] },
    async (request, reply) => {
      const input = updateWorkerSchema.parse(request.body);
      try {
        return await workersService.update(Number(request.params.id), input);
      } catch (err: any) {
        if (err.message === "WORKER_NOT_FOUND") {
          return reply.status(404).send({ error: "Operaio non trovato" });
        }
        throw err;
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/workers/:id",
    { preHandler: [fastify.authorize(["ADMIN"])] },
    async (request, reply) => {
      try {
        await workersService.delete(Number(request.params.id));
        return reply.status(204).send();
      } catch (err: any) {
        if (err.message === "WORKER_NOT_FOUND") {
          return reply.status(404).send({ error: "Operaio non trovato" });
        }
        throw err;
      }
    }
  );
};

export default workersRoutes;
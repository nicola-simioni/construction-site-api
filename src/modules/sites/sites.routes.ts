import type { FastifyPluginAsync } from "fastify";
import { SitesService } from "./sites.service";
import { createSiteSchema, updateSiteSchema } from "./sites.schema";

const sitesRoutes: FastifyPluginAsync = async (fastify) => {
  const sitesService = new SitesService(fastify.prisma);

  // GET /sites — tutti i ruoli autenticati
  fastify.get(
    "/sites",
    { preHandler: [fastify.authenticate] },
    async () => {
      return sitesService.findAll();
    }
  );

  // GET /sites/:id — tutti i ruoli autenticati
  fastify.get<{ Params: { id: string } }>(
    "/sites/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        return await sitesService.findOne(Number(request.params.id));
      } catch (err: any) {
        if (err.message === "SITE_NOT_FOUND") {
          return reply.status(404).send({ error: "Cantiere non trovato" });
        }
        throw err;
      }
    }
  );

  // POST /sites — solo ADMIN
  fastify.post(
    "/sites",
    { preHandler: [fastify.authorize(["ADMIN"])] },
    async (request, reply) => {
      const input = createSiteSchema.parse(request.body);
      try {
        const site = await sitesService.create(input);
        return reply.status(201).send(site);
      } catch (err: any) {
        if (err.message === "MANAGER_NOT_FOUND") {
          return reply.status(404).send({ error: "Manager non trovato" });
        }
        throw err;
      }
    }
  );

  // PATCH /sites/:id — solo ADMIN e SITE_MANAGER
  fastify.patch<{ Params: { id: string } }>(
    "/sites/:id",
    { preHandler: [fastify.authorize(["ADMIN", "SITE_MANAGER"])] },
    async (request, reply) => {
      const input = updateSiteSchema.parse(request.body);
      try {
        return await sitesService.update(Number(request.params.id), input);
      } catch (err: any) {
        if (err.message === "SITE_NOT_FOUND") {
          return reply.status(404).send({ error: "Cantiere non trovato" });
        }
        throw err;
      }
    }
  );

  // DELETE /sites/:id — solo ADMIN
  fastify.delete<{ Params: { id: string } }>(
    "/sites/:id",
    { preHandler: [fastify.authorize(["ADMIN"])] },
    async (request, reply) => {
      try {
        await sitesService.delete(Number(request.params.id));
        return reply.status(204).send();
      } catch (err: any) {
        if (err.message === "SITE_NOT_FOUND") {
          return reply.status(404).send({ error: "Cantiere non trovato" });
        }
        throw err;
      }
    }
  );

  // POST /sites/:id/workers/:workerId — aggiungi operaio
  fastify.post<{ Params: { id: string; workerId: string } }>(
    "/sites/:id/workers/:workerId",
    { preHandler: [fastify.authorize(["ADMIN", "SITE_MANAGER"])] },
    async (request, reply) => {
      try {
        await sitesService.addWorker(
          Number(request.params.id),
          Number(request.params.workerId)
        );
        return reply.status(204).send();
      } catch (err: any) {
        if (err.message === "SITE_NOT_FOUND") {
          return reply.status(404).send({ error: "Cantiere non trovato" });
        }
        throw err;
      }
    }
  );

  // DELETE /sites/:id/workers/:workerId — rimuovi operaio
  fastify.delete<{ Params: { id: string; workerId: string } }>(
    "/sites/:id/workers/:workerId",
    { preHandler: [fastify.authorize(["ADMIN", "SITE_MANAGER"])] },
    async (request, reply) => {
      try {
        await sitesService.removeWorker(
          Number(request.params.id),
          Number(request.params.workerId)
        );
        return reply.status(204).send();
      } catch (err: any) {
        if (err.message === "SITE_NOT_FOUND") {
          return reply.status(404).send({ error: "Cantiere non trovato" });
        }
        throw err;
      }
    }
  );
};

export default sitesRoutes;
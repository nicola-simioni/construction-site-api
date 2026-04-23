import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import type { Role } from "@prisma/client";

const authenticatePlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({ error: "Token non valido o mancante" });
      }
    }
  );

  fastify.decorate(
    "authorize",
    (roles: Role[]) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
          const user = request.user as { role: Role };
          if (!roles.includes(user.role)) {
            reply.status(403).send({ error: "Accesso non autorizzato" });
          }
        } catch (err) {
          reply.status(401).send({ error: "Token non valido o mancante" });
        }
      }
  );
});

export default authenticatePlugin;
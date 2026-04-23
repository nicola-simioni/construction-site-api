import type { FastifyPluginAsync } from "fastify";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const authService = new AuthService(fastify.prisma);

  fastify.post("/auth/register", async (request, reply) => {
    const input = registerSchema.parse(request.body);

    try {
      const user = await authService.register(input);
      return reply.status(201).send({ user });
    } catch (err: any) {
      if (err.message === "EMAIL_TAKEN") {
        return reply.status(409).send({ error: "Email già in uso" });
      }
      throw err;
    }
  });

  fastify.post("/auth/login", async (request, reply) => {
    const input = loginSchema.parse(request.body);

    try {
      const result = await authService.login(input, (payload) =>
        fastify.jwt.sign(payload)
      );
      return reply.send(result);
    } catch (err: any) {
      if (err.message === "INVALID_CREDENTIALS") {
        return reply.status(401).send({ error: "Credenziali non valide" });
      }
      throw err;
    }
  });
};

export default authRoutes;
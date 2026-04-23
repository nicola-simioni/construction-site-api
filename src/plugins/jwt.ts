import fp from "fastify-plugin";
import fjwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";
import { env } from "../config/env";

const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(fjwt, {
    secret: env.JWT_SECRET,
  });
});

export default jwtPlugin;
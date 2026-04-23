import "dotenv/config";
import Fastify from "fastify";
import { env } from "./config/env";
import prismaPlugin from "./plugins/prisma";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./modules/auth/auth.routes";

const server = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  },
});

// Plugins
server.register(prismaPlugin);
server.register(jwtPlugin);

// Routes
server.register(authRoutes);

// Health check
server.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Avvio server
const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
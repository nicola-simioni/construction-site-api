import "dotenv/config";
import Fastify from "fastify";
import { env } from "./config/env";
import prismaPlugin from "./plugins/prisma";
import jwtPlugin from "./plugins/jwt";
import authenticatePlugin from "./plugins/authenticate";
import authRoutes from "./modules/auth/auth.routes";
import sitesRoutes from "./modules/sites/sites.routes";
import workersRoutes from "./modules/workers/workers.routes";
import workLogsRoutes from "./modules/worklogs/worklogs.routes";

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
server.register(authenticatePlugin);

// Routes
server.register(authRoutes);
server.register(sitesRoutes);
server.register(workersRoutes);
server.register(workLogsRoutes);

// Health check
server.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
/*
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
*/

// prisma.config.ts (project root)
import 'dotenv/config';            // <-- loads .env at startup
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // keep defaults; you can add overrides later if you want
  schema: './prisma/schema.prisma',
});


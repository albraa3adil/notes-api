import dotenv from "dotenv";

dotenv.config();

function checkRequiredEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
  nodeEnv: process.env.NODE_ENV ?? "development",
  logLevel: process.env.LOG_LEVEL ?? "info",
  databaseUrl: checkRequiredEnvVar("DATABASE_URL"),
//   jwtAccessSecret: checkRequiredEnvVar("JWT_SECRET"),
//   jwtAccessExpiresIn: checkRequiredEnvVar("JWT_ACCESS_EXPIRES_IN")
} as const;


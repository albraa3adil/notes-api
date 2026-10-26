import dotenv from "dotenv";

const DEFAULT_DEV_CORS_ORIGINS = "http://localhost:3300";

dotenv.config();

function checkRequiredEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};


const nodeEnv = process.env.NODE_ENV ?? "development";
const isProduction = nodeEnv === "production";
const corsOrigins = parseList(
  isProduction
    ? checkRequiredEnvVar("CORS_ORIGINS")
    : process.env.CORS_ORIGINS ?? DEFAULT_DEV_CORS_ORIGINS
);

if (isProduction && corsOrigins.length === 0) {
  throw new Error("CORS_ORIGINS must contain at least one origin in production.");
}


export const env = {
  port: Number(process.env.PORT ?? 3000),
  isProduction,
  nodeEnv,
  logLevel: process.env.LOG_LEVEL ?? "info",
  databaseUrl: checkRequiredEnvVar("DATABASE_URL"),
  corsOrigins,
//   jwtAccessSecret: checkRequiredEnvVar("JWT_SECRET"),
//   jwtAccessExpiresIn: checkRequiredEnvVar("JWT_ACCESS_EXPIRES_IN")
} as const;


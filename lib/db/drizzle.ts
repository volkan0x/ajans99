import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Skip database connection during build time
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.POSTGRES_URL;

if (!isBuildTime && !process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

export const client = isBuildTime ? null : postgres(process.env.POSTGRES_URL!);
export const db = isBuildTime ? null : drizzle(client!, { schema });

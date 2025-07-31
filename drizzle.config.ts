import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle', // Output directory
    schema: './src/db/schema.ts', // Path to schema file
    dialect: 'mysql', // MySQL dialect
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
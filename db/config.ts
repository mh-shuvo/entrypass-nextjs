import "dotenv/config";

const DATABASE_HOST = process.env["DATABASE_HOST"] || "localhost";
const DATABASE_PORT = process.env["DATABASE_PORT"] || "3306";
const DATABASE_USER = process.env["DATABASE_USER"] || "root";
const DATABASE_PASSWORD = process.env["DATABASE_PASSWORD"] || "";
const DATABASE_NAME = process.env["DATABASE_NAME"] || "entrypass-nextjs";

export const DATABASE_URL = `mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const prismaSchemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in .env');
  process.exit(1);
}

const getProvider = (url: string): string => {
  const protocol = url.split(':')[0].toLowerCase();
  switch (protocol) {
    case 'postgresql':
    case 'postgres':
    case 'prisma+postgres':
      return 'postgresql';
    case 'mysql':
      return 'mysql';
    case 'mongodb':
    case 'mongodb+srv':
      return 'mongodb';
    case 'sqlserver':
      return 'sqlserver';
    case 'sqlite':
    case 'file':
        return 'sqlite';
    default:
      console.warn(`Unknown protocol: ${protocol}. Defaulting to postgresql.`);
      return 'postgresql';
  }
};

const provider = getProvider(databaseUrl);
let schema = fs.readFileSync(prismaSchemaPath, 'utf8');

const updatedSchema = schema.replace(
  /provider\s*=\s*"[^"]*"\s*\/\/ datasource/,
  `provider = "${provider}" // datasource`
).replace(
  /provider\s*=\s*"[^"]*"/,
  (match, offset, string) => {
    // We only want to replace the provider in the datasource block if it wasn't already replaced by the specialized regex
    // or if we have multiple providers (like generator and datasource).
    // Actually, it's safer to target the datasource block specifically.
    return match;
  }
);

// Improved regex to specifically target the datasource block
const dataSourceRegex = /datasource\s+db\s+{[^}]*provider\s*=\s*"[^"]*"[^}]*}/;
const newSchema = schema.replace(dataSourceRegex, (match) => {
  return match.replace(/provider\s*=\s*"[^"]*"/, `provider = "${provider}"`);
});

fs.writeFileSync(prismaSchemaPath, newSchema);
console.log(`Updated Prisma provider to: ${provider}`);

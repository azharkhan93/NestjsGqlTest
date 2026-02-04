import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma');
const DATABASE_URL = process.env.DATABASE_URL;

const PROTOCOL_MAP: Record<string, string> = {
  postgresql: 'postgresql',
  postgres: 'postgresql',
  'prisma+postgres': 'postgresql',
  mysql: 'mysql',
  mongodb: 'mongodb',
  'mongodb+srv': 'mongodb',
  sqlserver: 'sqlserver',
  sqlite: 'sqlite',
  file: 'sqlite',
};

const ID_TEMPLATES: Record<string, string> = {
  mongodb: '  id    String @id @default(auto()) @map("_id") @db.ObjectId // @id:dynamic',
  default: '  id    String @id @default(uuid()) // @id:dynamic',
};

function getProvider(url: string): string {
  const protocol = url.split(':')[0].toLowerCase();
  const provider = PROTOCOL_MAP[protocol];
  if (!provider) {
    console.warn(`Unknown protocol: ${protocol}. Defaulting to postgresql.`);
    return 'postgresql';
  }
  return provider;
}

function updateSchema(content: string, provider: string): string {
  // Update datasource provider
  let updated = content.replace(
    /datasource\s+db\s+{[^}]*provider\s*=\s*"[^"]*"[^}]*}/,
    (match) => match.replace(/provider\s*=\s*"[^"]*"/, `provider = "${provider}"`)
  );

  // Update dynamic IDs
  const idLine = ID_TEMPLATES[provider] || ID_TEMPLATES.default;
  updated = updated.replace(/^.*@id:dynamic.*$/gm, idLine);

  return updated;
}

function main() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env');
    process.exit(1);
  }

  try {
    const provider = getProvider(DATABASE_URL);
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    const updatedSchema = updateSchema(schema, provider);

    fs.writeFileSync(SCHEMA_PATH, updatedSchema);
    console.log(`Successfully updated Prisma schema for: ${provider}`);
  } catch (error) {
    console.error('Failed to update Prisma schema:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

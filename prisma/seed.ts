import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Set up the native PG driver
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize client with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear data to ensure a clean test environment
  await prisma.leaveRequest.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: { name: 'Acme Corp' },
  });

  const user = await prisma.user.create({
    data: {
      email: 'dev@acme.com',
      organizationId: org.id,
    },
  });

  console.log('--- Seed Data Created ---');
  console.log(`Organization ID: ${org.id}`);
  console.log(`User ID:         ${user.id}`);
  console.log('-------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Close the pool
  });
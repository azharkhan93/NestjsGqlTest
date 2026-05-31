import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Roles
  console.log('Seeding Roles...');
  const superAdminRole = await prisma.role.upsert({
    where: { name: UserRole.SUPER_ADMIN },
    update: {},
    create: { name: UserRole.SUPER_ADMIN },
  });

  await prisma.role.upsert({
    where: { name: UserRole.CUSTOMER },
    update: {},
    create: { name: UserRole.CUSTOMER },
  });

  await prisma.role.upsert({
    where: { name: UserRole.PROVIDER },
    update: {},
    create: { name: UserRole.PROVIDER },
  });

  console.log('✅ Roles seeded successfully');

  // 2. Seed Super Admin User
  console.log('Seeding Super Admin...');
  const adminEmail = 'admin@example.com';
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Super Admin',
      password: adminPasswordHash,
      roleId: superAdminRole.id,
    },
  });

  console.log('✅ Super Admin user seeded successfully');

  // 3. Seed Service Categories
  console.log('Seeding Service Categories...');
  interface CategorySeed {
    name: string;
    icon: string;
  }

  const categories: readonly CategorySeed[] = [
    { name: 'Car Wash', icon: 'local_car_wash' },
    { name: 'Detailing', icon: 'brush' },
    { name: 'Interior Cleaning', icon: 'vacuum' },
    { name: 'Paint Protection', icon: 'shield' },
  ];

  for (const cat of categories) {
    const existing = await prisma.serviceCategory.findFirst({
      where: { name: cat.name },
    });
    if (!existing) {
      await prisma.serviceCategory.create({
        data: {
          name: cat.name,
          icon: cat.icon,
        },
      });
      console.log(`   Created category: ${cat.name}`);
    } else {
      console.log(`   Category already exists: ${cat.name}`);
    }
  }

  console.log('✅ Service Categories seeded successfully');
  console.log('🏁 Database seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: Error) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

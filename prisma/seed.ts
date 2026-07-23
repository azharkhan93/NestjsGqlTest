import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

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

  // Seed sample Vendor Profiles
  console.log('Seeding Sample Vendor Profiles...');
  const providerRole = await prisma.role.findUnique({
    where: { name: UserRole.PROVIDER },
  });

  if (providerRole) {
    const sampleVendors = [
      {
        phone: '+919876543210',
        name: 'Quick Shine Wash',
        businessName: 'Quick Shine Co.',
        imageUri: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80',
        address: '742 Evergreen Terrace, Downtown',
        serviceRadius: '5 km radius',
        operatingHours: '08:00 AM - 08:00 PM',
        description: 'Professional eco-friendly car wash & detailing experts.',
        whyChooseMe: 'Fast 30 min turnarounds, premium foam, paint safety guaranteed.',
      },
      {
        phone: '+919876543211',
        name: 'Green Wash Eco',
        businessName: 'Green Wash',
        imageUri: 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?w=800&q=80',
        address: '123 Maple Avenue, Midtown',
        serviceRadius: '10 km radius',
        operatingHours: '09:00 AM - 07:00 PM',
        description: 'Zero water waste steam wash and interior sanitization.',
        whyChooseMe: '100% biodegradable products & door-step mobile service.',
      },
      {
        phone: '+919876543212',
        name: 'Elite Auto Detailers',
        businessName: 'Elite Detailers',
        imageUri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        address: '456 Oak Street, Westside',
        serviceRadius: '15 km radius',
        operatingHours: '07:30 AM - 09:00 PM',
        description: 'Luxury ceramic coating, wax polish & premium interior detailing.',
        whyChooseMe: 'Certified detailers, scratch protection, 5-star guarantee.',
      },
    ];

    for (const v of sampleVendors) {
      let user = await prisma.user.findFirst({
        where: { phoneNumber: v.phone },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            phoneNumber: v.phone,
            name: v.name,
            roleId: providerRole.id,
          },
        });
      }

      const existingProfile = await prisma.vendorProfile.findFirst({
        where: { userId: user.id },
      });

      if (!existingProfile) {
        await prisma.vendorProfile.create({
          data: {
            userId: user.id,
            businessName: v.businessName,
            imageUri: v.imageUri,
            address: v.address,
            serviceRadius: v.serviceRadius,
            operatingHours: v.operatingHours,
            description: v.description,
            whyChooseMe: v.whyChooseMe,
            contactNumber: v.phone,
          },
        });
        console.log(`   Created Vendor Profile: ${v.businessName}`);
      }
    }
  }

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

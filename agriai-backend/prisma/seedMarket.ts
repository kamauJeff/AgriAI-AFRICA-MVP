import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const crops = ['Maize', 'Beans', 'Rice', 'Wheat', 'Coffee', 'Tea', 'Potatoes', 'Tomatoes', 'Onions', 'Cabbage'];
const regions = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Meru', 'Nyeri', 'Kericho'];

function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🌱 Seeding market prices...');

  // Clear existing data
  await prisma.cropPrice.deleteMany({});

  const prices = [];
  const startDate = new Date('2026-01-01');
  const endDate = new Date();

  // Generate prices for each crop in each region over the last 2 months
  for (const crop of crops) {
    for (const region of regions) {
      // Each crop-region pair gets 3-5 price entries
      const numEntries = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < numEntries; i++) {
        let priceRange;
        if (crop === 'Coffee') priceRange = [300, 500];
        else if (crop === 'Tea') priceRange = [200, 350];
        else if (crop === 'Maize') priceRange = [40, 80];
        else if (crop === 'Beans') priceRange = [70, 120];
        else if (crop === 'Rice') priceRange = [120, 200];
        else if (crop === 'Wheat') priceRange = [50, 90];
        else if (crop === 'Potatoes') priceRange = [30, 60];
        else if (crop === 'Tomatoes') priceRange = [50, 150];
        else if (crop === 'Onions') priceRange = [80, 140];
        else priceRange = [40, 100];

        prices.push({
          crop,
          region,
          price: randomPrice(priceRange[0], priceRange[1]),
          date: randomDate(startDate, endDate),
        });
      }
    }
  }

  // Insert in batches to avoid memory issues
  const batchSize = 100;
  for (let i = 0; i < prices.length; i += batchSize) {
    const batch = prices.slice(i, i + batchSize);
    await prisma.cropPrice.createMany({
      data: batch,
    });
    console.log(`  ✅ Inserted ${i + batch.length} of ${prices.length} prices`);
  }

  console.log('✅ Seeding completed!');
  console.log(`📊 Total prices seeded: ${prices.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    // Instead of process.exit(1), just rethrow the error.
    // Node will automatically exit with a non-zero code.
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
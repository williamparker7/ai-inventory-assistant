import 'dotenv/config';
import pool from './db.js';

const sampleItems = [
  {
    name: 'Caterpillar 320 Excavator',
    category: 'Excavators',
    description: '2022 CAT 320 hydraulic excavator with thumb attachment. 5,200 hours. Excellent undercarriage.',
    price: 185000.00,
    stock_quantity: 2,
    condition_status: 'used',
    manufacturer: 'Caterpillar',
    model_number: '320',
    year: 2022,
  },
  {
    name: 'John Deere 310SL Backhoe',
    category: 'Backhoes',
    description: 'Cab with heat and AC, 4WD, extendahoe. Recently serviced.',
    price: 72000.00,
    stock_quantity: 1,
    condition_status: 'used',
    manufacturer: 'John Deere',
    model_number: '310SL',
    year: 2020,
  },
  {
    name: 'Bobcat S650 Skid Steer',
    category: 'Skid Steers',
    description: 'Brand new 2025 model. 74 HP, rated operating capacity 2,690 lbs.',
    price: 52500.00,
    stock_quantity: 5,
    condition_status: 'new',
    manufacturer: 'Bobcat',
    model_number: 'S650',
    year: 2025,
  },
  {
    name: 'Komatsu WA270 Wheel Loader',
    category: 'Wheel Loaders',
    description: '2021 Komatsu wheel loader. 3,800 hours. Bucket and forks included.',
    price: 145000.00,
    stock_quantity: 1,
    condition_status: 'used',
    manufacturer: 'Komatsu',
    model_number: 'WA270-8',
    year: 2021,
  },
  {
    name: 'CAT D6 Dozer',
    category: 'Dozers',
    description: 'Refurbished D6 with new undercarriage, fresh paint, EROPS cab.',
    price: 210000.00,
    stock_quantity: 1,
    condition_status: 'refurbished',
    manufacturer: 'Caterpillar',
    model_number: 'D6',
    year: 2019,
  },
  {
    name: 'Wacker Neuson DPU6555 Plate Compactor',
    category: 'Compaction',
    description: 'Reversible vibratory plate compactor. Low hours.',
    price: 4200.00,
    stock_quantity: 8,
    condition_status: 'new',
    manufacturer: 'Wacker Neuson',
    model_number: 'DPU6555',
    year: 2025,
  },
  {
    name: 'Genie S-65 Boom Lift',
    category: 'Aerial Lifts',
    description: '65 ft telescopic boom lift. Diesel 4WD. Annual inspection current.',
    price: 38000.00,
    stock_quantity: 3,
    condition_status: 'used',
    manufacturer: 'Genie',
    model_number: 'S-65',
    year: 2021,
  },
  {
    name: 'Volvo EC220E Excavator',
    category: 'Excavators',
    description: 'Low-hour Volvo mid-size excavator. Excellent fuel economy.',
    price: 165000.00,
    stock_quantity: 1,
    condition_status: 'used',
    manufacturer: 'Volvo',
    model_number: 'EC220E',
    year: 2023,
  },
  {
    name: 'Takeuchi TB240 Mini Excavator',
    category: 'Mini Excavators',
    description: 'Compact excavator, perfect for tight spaces. Blade and thumb.',
    price: 45000.00,
    stock_quantity: 4,
    condition_status: 'new',
    manufacturer: 'Takeuchi',
    model_number: 'TB240',
    year: 2025,
  },
  {
    name: 'JLG 1932R Scissor Lift',
    category: 'Aerial Lifts',
    description: 'Electric scissor lift, 19ft platform height. Indoor/outdoor rated.',
    price: 8500.00,
    stock_quantity: 6,
    condition_status: 'new',
    manufacturer: 'JLG',
    model_number: '1932R',
    year: 2025,
  },
  {
    name: 'Case 580 Super N Backhoe',
    category: 'Backhoes',
    description: '4WD, cab, extendahoe, ride control. One owner, dealer maintained.',
    price: 88000.00,
    stock_quantity: 2,
    condition_status: 'used',
    manufacturer: 'Case',
    model_number: '580 Super N',
    year: 2022,
  },
  {
    name: 'Hydraulic Breaker Attachment (CAT)',
    category: 'Attachments',
    description: 'Fits 20-ton class excavators. Recently rebuilt.',
    price: 12000.00,
    stock_quantity: 3,
    condition_status: 'refurbished',
    manufacturer: 'Caterpillar',
    model_number: 'H130S',
    year: 2020,
  },
];

async function seed() {
  console.log('Seeding database...\n');

  // Clear existing data
  await pool.execute('DELETE FROM inventory_items');

  for (const item of sampleItems) {
    await pool.execute(
      `INSERT INTO inventory_items (name, category, description, price, stock_quantity, condition_status, manufacturer, model_number, year)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.name, item.category, item.description, item.price, item.stock_quantity, item.condition_status, item.manufacturer, item.model_number, item.year]
    );
    console.log(`  ✓ ${item.name}`);
  }

  console.log(`\nSeeded ${sampleItems.length} items!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

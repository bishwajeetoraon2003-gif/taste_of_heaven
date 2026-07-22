const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require('bcryptjs');
const { supabase, memoryDb } = require('../config/db');
const logger = require('../utils/logger');

async function seedDatabase() {
  logger.info('Seeding database with default Admin, Staff, and Menu Items...');

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);

  const adminUser = {
    name: 'Executive Chef Antoine',
    email: 'admin@tasteofheaven.com',
    password_hash: adminPassword,
    role: 'admin',
    is_confirmed: true
  };

  const initialMenuItems = [
    {
      title: "A5 Miyazaki Wagyu Tenderloin",
      category: "specials",
      price: 185.00,
      rating: 4.9,
      veg: false,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      description: "Pan-seared A5 Wagyu with black truffle reduction, smoked bone marrow emulsion, and seasonal wild mushrooms.",
      allergens: "Dairy, Mushrooms"
    },
    {
      title: "Butter-Poached Maine Lobster",
      category: "mains",
      price: 145.00,
      rating: 4.8,
      veg: false,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=80",
      description: "Sous-vide Maine lobster tail served over saffron risotto, sea asparagus, and Meyer lemon foam.",
      allergens: "Shellfish, Dairy"
    },
    {
      title: "Wild Organic Truffle Carpaccio",
      category: "starters",
      price: 68.00,
      rating: 4.9,
      veg: true,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      description: "Paper-thin black truffle slices, 36-month aged Parmigiano Reggiano crisp, organic microgreens, and cold-pressed extra virgin olive oil.",
      allergens: "Dairy"
    },
    {
      title: "Gold Leaf Chocolate Sphere",
      category: "desserts",
      price: 45.00,
      rating: 5.0,
      veg: true,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
      description: "24-Karat edible gold encasing Valrhona dark chocolate mousse, hot raspberry coulis poured tableside.",
      allergens: "Dairy, Gluten, Soy"
    }
  ];

  if (supabase) {
    try {
      // Seed Admin User
      const { data: existingAdmin } = await supabase.from('users').select('id').eq('email', adminUser.email).single();
      if (!existingAdmin) {
        await supabase.from('users').insert([adminUser]);
        logger.info('Supabase: Admin user created.');
      }

      // Seed Menu Items
      const { data: existingMenu } = await supabase.from('menu_items').select('id');
      if (!existingMenu || existingMenu.length === 0) {
        await supabase.from('menu_items').insert(initialMenuItems);
        logger.info('Supabase: Initial menu items seeded.');
      }
    } catch (err) {
      logger.error('Error seeding Supabase tables:', err.message);
    }
  }

  // Memory fallback sync
  memoryDb.users.push({ ...adminUser, id: 'admin-001' });

  logger.info('✨ Database seeded successfully!');
  logger.info('Default Admin Credentials -> Email: admin@tasteofheaven.com | Password: admin123');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

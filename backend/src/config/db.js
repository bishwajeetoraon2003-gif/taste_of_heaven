const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

let supabase = null;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (SUPABASE_URL && SUPABASE_URL !== 'https://your-supabase-project.supabase.co' && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    logger.info('Supabase client initialized successfully.');
  } catch (err) {
    logger.error('Failed to initialize Supabase client:', err.message);
  }
} else {
  logger.info('Supabase credentials not configured. Operating in Local High-Performance Memory DB mode.');
}

// In-Memory Data Storage Fallback for local development & immediate testing
const memoryDb = {
  users: [],
  menuItems: [
    {
      id: 1,
      title: "A5 Miyazaki Wagyu Tenderloin",
      category: "specials",
      price: 185.00,
      rating: 4.9,
      veg: false,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      description: "Pan-seared A5 Wagyu with black truffle reduction, smoked bone marrow emulsion, and seasonal wild mushrooms.",
      allergens: "Dairy, Mushrooms",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Butter-Poached Maine Lobster",
      category: "mains",
      price: 145.00,
      rating: 4.8,
      veg: false,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=80",
      description: "Sous-vide Maine lobster tail served over saffron risotto, sea asparagus, and Meyer lemon foam.",
      allergens: "Shellfish, Dairy",
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "Wild Organic Truffle Carpaccio",
      category: "starters",
      price: 68.00,
      rating: 4.9,
      veg: true,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      description: "Paper-thin black truffle slices, 36-month aged Parmigiano Reggiano crisp, organic microgreens, and cold-pressed extra virgin olive oil.",
      allergens: "Dairy",
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: "Pan-Seared Chilean Sea Bass",
      category: "mains",
      price: 120.00,
      rating: 4.7,
      veg: false,
      popular: false,
      image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
      description: "Wild-caught Chilean Sea Bass with dashi broth, baby bok choy, and ginger oil infusion.",
      allergens: "Fish, Soy",
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      title: "Gold Leaf Chocolate Sphere",
      category: "desserts",
      price: 45.00,
      rating: 5.0,
      veg: true,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80",
      description: "24-Karat edible gold encasing Valrhona dark chocolate mousse, hot raspberry coulis poured tableside.",
      allergens: "Dairy, Gluten, Soy",
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      title: "Celestial Smoked Old Fashioned",
      category: "cocktails",
      price: 32.00,
      rating: 4.9,
      veg: true,
      popular: true,
      image_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
      description: "Rare Macallan 18yr scotch, organic smoked applewood bitters, hand-carved ice sphere, and orange twist flame.",
      allergens: "Alcohol",
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      title: "Heirloom Burrata & Peach Caviar",
      category: "starters",
      price: 55.00,
      rating: 4.8,
      veg: true,
      popular: false,
      image_url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80",
      description: "Handmade Pugliese burrata, heirloom tomatoes, balsamic spherification caviar, and fresh basil blossom oil.",
      allergens: "Dairy",
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      title: "Deconstructed Golden Mille-Feuille",
      category: "desserts",
      price: 40.00,
      rating: 4.9,
      veg: true,
      popular: false,
      image_url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
      description: "Caramelized puff pastry, Tahitian vanilla bean diplomat cream, praline crunch, and gold leaf.",
      allergens: "Gluten, Dairy",
      created_at: new Date().toISOString()
    }
  ],
  reservations: [],
  orders: [],
  contactInquiries: []
};

module.exports = {
  supabase,
  memoryDb
};

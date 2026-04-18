// src/lib/demo-products.ts
// Shown when Firebase is not yet configured, so the site always looks good.

import { Product } from "@/types";

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    name: "Samsung Galaxy A15",
    price: 85000,
    category: "electronics",
    shortDesc: "Brand new, sealed box. 4GB RAM, 128GB storage, 5000mAh battery.",
    description:
      "Brand new Samsung Galaxy A15 in sealed box.\n\n• 6.5-inch Super AMOLED display\n• 4GB RAM / 128GB storage\n• 50MP triple camera\n• 5000mAh battery\n• Warranty included\n\nAvailable in black and blue. Serious buyers only.",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=75",
    images: [],
    seller: {
      id: "tiwonge-phones",
      name: "Tiwonge Phones",
      whatsapp: "265991234567",
      location: "Lilongwe, Old Town",
    },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "demo-2",
    name: "Chitenje Fabric (6 yards)",
    price: 4500,
    category: "fashion",
    shortDesc: "Beautiful Malawian chitenje. Various patterns available.",
    description:
      "Genuine Malawian chitenje fabric, 6 yards per piece.\n\nMultiple vibrant patterns available — contact me on WhatsApp to see the full selection.\n\nGood for dresses, wrappers, and gifts. Bulk discounts available for 5+ pieces.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75",
    images: [],
    seller: {
      id: "amai-fashion",
      name: "Amai Fashion",
      whatsapp: "265888765432",
      location: "Blantyre, Limbe Market",
    },
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "demo-3",
    name: "Fresh Tomatoes (10kg bag)",
    price: 3000,
    category: "food",
    shortDesc: "Farm-fresh tomatoes. Delivered Tuesday and Friday from Mzuzu.",
    description:
      "Fresh tomatoes delivered every Tuesday and Friday from our farm in Mzuzu.\n\n10kg bag — perfect for restaurants, catering, or families.\n\nOrder by Monday evening for Tuesday delivery.\nOrder by Thursday evening for Friday delivery.\n\nDelivery available in Lilongwe Area 3, 18, 23, and 25.",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=75",
    images: [],
    seller: {
      id: "mzuzu-fresh-farm",
      name: "Mzuzu Fresh Farm",
      whatsapp: "265999111222",
      location: "Lilongwe (delivery)",
    },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "demo-4",
    name: "Wooden Dining Table (6 seats)",
    price: 120000,
    category: "home",
    shortDesc: "Solid mvule wood, handmade locally. Excellent quality.",
    description:
      "Solid mvule wood dining table, seats 6 people comfortably.\n\nHandcrafted by local carpenters in Zomba. Very sturdy and beautiful grain.\n\nDimensions: 180cm × 90cm × 76cm\nIncludes 6 matching chairs.\n\nCan arrange delivery within Lilongwe for MWK 5,000 extra.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=75",
    images: [],
    seller: {
      id: "chikonde-carpentry",
      name: "Chikonde Carpentry",
      whatsapp: "265882334455",
      location: "Zomba Town",
    },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "demo-5",
    name: "Toyota Vitz 2010",
    price: 3200000,
    category: "vehicles",
    shortDesc: "Well maintained, low mileage, one owner. Full service history.",
    description:
      "2010 Toyota Vitz in excellent condition.\n\n• Engine: 1000cc\n• Mileage: 68,000 km\n• Fuel: Petrol\n• Colour: Silver\n• Manual transmission\n\nFull service history available. Clean title. Test drive available in Lilongwe.",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=75",
    images: [],
    seller: {
      id: "kondwani-autos",
      name: "Kondwani Autos",
      whatsapp: "265777556677",
      location: "Lilongwe, Area 47",
    },
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "demo-6",
    name: "Plumbing Services",
    price: 15000,
    category: "services",
    shortDesc: "Professional plumber. Pipes, taps, water tanks, toilets.",
    description:
      "Qualified plumber available for residential and commercial work in Lilongwe.\n\nServices:\n• Pipe installation and repair\n• Tap replacement\n• Water tank installation\n• Toilet fitting and repair\n• Drainage blockages\n\nCall-out fee included. Available Monday–Saturday, 7am–6pm.",
    image:
      "https://images.unsplash.com/photo-1558618047-3d1c5b4d8c45?w=600&q=75",
    images: [],
    seller: {
      id: "fix-it-plumbers",
      name: "Fix-It Plumbers",
      whatsapp: "265991888999",
      location: "Lilongwe",
    },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

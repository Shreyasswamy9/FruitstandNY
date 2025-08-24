import dbConnect from '@/lib/database';
import { Product, User } from '@/database';
import bcrypt from 'bcryptjs';

const seedProducts = [
  {
    name: "Green Hat",
    description: "A comfortable and stylish green hat perfect for casual wear. Made from high-quality materials.",
    price: 25,
    category: "accessories",
    subcategory: "hats",
    images: ["/images/green1.jpeg"],
    hoverImage: "/images/green2.jpeg",
    inventory: {
      quantity: 50,
      sizes: [
        { size: "S", quantity: 15 },
        { size: "M", quantity: 20 },
        { size: "L", quantity: 15 }
      ]
    },
    featured: true,
    tags: ["hat", "green", "casual", "unisex"],
    specifications: {
      material: "Cotton",
      color: "Green",
      care: "Hand wash only"
    },
    seo: {
      title: "Comfortable Green Hat - Fruitstand NY",
      description: "Shop our stylish green hat, perfect for any casual occasion.",
      keywords: ["green hat", "casual wear", "accessories"]
    }
  },
  {
    name: "Red T-Shirt",
    description: "A premium red t-shirt made from 100% organic cotton. Soft, breathable, and perfect for everyday wear.",
    price: 25,
    category: "clothing",
    subcategory: "t-shirts",
    images: ["/images/red1.jpeg"],
    hoverImage: "/images/red2.jpeg",
    inventory: {
      quantity: 100,
      sizes: [
        { size: "XS", quantity: 10 },
        { size: "S", quantity: 25 },
        { size: "M", quantity: 30 },
        { size: "L", quantity: 25 },
        { size: "XL", quantity: 10 }
      ]
    },
    featured: true,
    tags: ["t-shirt", "red", "cotton", "unisex"],
    specifications: {
      material: "100% Organic Cotton",
      color: "Red",
      care: "Machine wash cold"
    },
    seo: {
      title: "Premium Red T-Shirt - Fruitstand NY",
      description: "Comfortable organic cotton red t-shirt for everyday wear.",
      keywords: ["red t-shirt", "organic cotton", "clothing"]
    }
  },
  {
    name: "Classic White Tee",
    description: "A timeless white t-shirt that goes with everything. Essential wardrobe staple.",
    price: 25,
    category: "clothing",
    subcategory: "t-shirts",
    images: ["/images/white1.jpeg"],
    hoverImage: "/images/white 2.jpeg",
    inventory: {
      quantity: 150,
      sizes: [
        { size: "XS", quantity: 20 },
        { size: "S", quantity: 35 },
        { size: "M", quantity: 40 },
        { size: "L", quantity: 35 },
        { size: "XL", quantity: 20 }
      ]
    },
    featured: false,
    tags: ["t-shirt", "white", "classic", "essential"],
    specifications: {
      material: "100% Cotton",
      color: "White",
      care: "Machine wash warm"
    },
    seo: {
      title: "Classic White T-Shirt - Fruitstand NY",
      description: "Essential white t-shirt, perfect for any wardrobe.",
      keywords: ["white t-shirt", "classic", "wardrobe essential"]
    }
  },
  {
    name: "Black Statement Tee",
    description: "Bold black t-shirt with modern styling. Perfect for making a statement.",
    price: 25,
    category: "clothing",
    subcategory: "t-shirts",
    images: ["/images/black1.jpeg"],
    hoverImage: "/images/black2.jpeg",
    inventory: {
      quantity: 75,
      sizes: [
        { size: "S", quantity: 20 },
        { size: "M", quantity: 25 },
        { size: "L", quantity: 20 },
        { size: "XL", quantity: 10 }
      ]
    },
    featured: false,
    tags: ["t-shirt", "black", "statement", "modern"],
    specifications: {
      material: "Cotton Blend",
      color: "Black",
      care: "Machine wash cold, tumble dry low"
    },
    seo: {
      title: "Black Statement T-Shirt - Fruitstand NY",
      description: "Make a statement with our bold black t-shirt design.",
      keywords: ["black t-shirt", "statement", "modern style"]
    }
  },
  {
    name: "Premium Hoodie",
    description: "Comfortable premium hoodie perfect for layering. Made with soft fleece interior.",
    price: 45,
    category: "clothing",
    subcategory: "hoodies",
    images: ["/images/tshirt1.jpeg"],
    hoverImage: "/images/tshirt back.jpeg",
    inventory: {
      quantity: 60,
      sizes: [
        { size: "S", quantity: 15 },
        { size: "M", quantity: 20 },
        { size: "L", quantity: 15 },
        { size: "XL", quantity: 10 }
      ]
    },
    featured: true,
    tags: ["hoodie", "comfortable", "premium", "layering"],
    specifications: {
      material: "Cotton/Polyester Blend",
      color: "Gray",
      care: "Machine wash cold, hang dry"
    },
    seo: {
      title: "Premium Comfortable Hoodie - Fruitstand NY",
      description: "Stay warm and comfortable with our premium hoodie.",
      keywords: ["hoodie", "premium", "comfortable", "fleece"]
    }
  }
];

const seedAdminUser = {
  name: "Admin User",
  email: "admin@fruitstand.ny",
  password: "admin123",
  role: "admin" as const
};

export async function seedDatabase() {
  try {
    await dbConnect();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Seed products
    await Product.insertMany(seedProducts);
    console.log(`🌱 Seeded ${seedProducts.length} products`);

    // Seed admin user
    const hashedPassword = await bcrypt.hash(seedAdminUser.password, 12);
    await User.create({
      ...seedAdminUser,
      password: hashedPassword
    });
    console.log('👤 Seeded admin user');

    console.log('✅ Database seeded successfully!');
    console.log(`📧 Admin login: ${seedAdminUser.email}`);
    console.log(`🔑 Admin password: ${seedAdminUser.password}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

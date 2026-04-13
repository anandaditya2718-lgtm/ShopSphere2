import 'dotenv/config';
import mongoose from 'mongoose';
import productModel from '../models/productModel.js';

const seedProducts = [
  {
    name: 'Men Round Neck Cotton T-Shirt',
    description: 'Soft cotton t-shirt for daily wear.',
    price: 499,
    image: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200'],
    category: 'Men',
    subCategory: 'Topwear',
    sizes: ['S', 'M', 'L', 'XL'],
    bestseller: true,
    date: Date.now()
  },
  
  {
    name: 'Women Slim Fit Jeans',
    description: 'Comfortable stretch denim with modern fit.',
    price: 899,
    image: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200'],
    category: 'Women',
    subCategory: 'Bottomwear',
    sizes: ['S', 'M', 'L'],
    bestseller: true,
    date: Date.now()
  },
  {
    name: 'Kids Winter Hoodie',
    description: 'Warm hoodie for winter season.',
    price: 699,
    image: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200'],
    category: 'Kids',
    subCategory: 'Winterwear',
    sizes: ['S', 'M', 'L'],
    bestseller: false,
    date: Date.now()
  },
  {
    name: 'Men Casual Trousers',
    description: 'Relaxed fit trousers for everyday comfort.',
    price: 1099,
    image: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200'],
    category: 'Men',
    subCategory: 'Bottomwear',
    sizes: ['M', 'L', 'XL'],
    bestseller: false,
    date: Date.now()
  },
  {
    name: 'Women Printed Top',
    description: 'Lightweight printed top with soft fabric.',
    price: 599,
    image: ['https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200'],
    category: 'Women',
    subCategory: 'Topwear',
    sizes: ['S', 'M', 'L', 'XL'],
    bestseller: true,
    date: Date.now()
  }
];

const runSeed = async () => {
  try {
    const baseUri = (process.env.MONGODB_URI || '').trim();

    if (!baseUri) {
      throw new Error('MONGODB_URI is missing in backend/.env');
    }

    await mongoose.connect(`${baseUri}/ecommerce`);

    const existingCount = await productModel.countDocuments();
    if (existingCount > 0) {
      console.log(`Seed skipped: ${existingCount} product(s) already exist.`);
      process.exit(0);
    }

    await productModel.insertMany(seedProducts);
    console.log(`Seed complete: inserted ${seedProducts.length} product(s).`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

runSeed();

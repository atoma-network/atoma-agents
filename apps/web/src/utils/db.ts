import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Type the global object with our custom property
const globalWithMongoose = global as typeof globalThis & {
  _mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

// Initialize the cache if it doesn't exist
if (!globalWithMongoose._mongooseCache) {
  globalWithMongoose._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  // At this point we know _mongooseCache exists because we initialized it above
  const mongooseCache = globalWithMongoose._mongooseCache!;

  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    mongooseCache.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    const mongoose = await mongooseCache.promise;
    mongooseCache.conn = mongoose;
    console.log('Connected to MongoDB');
    return mongoose;
  } catch (e) {
    mongooseCache.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    // At this point we know _mongooseCache exists because we initialized it above
    const mongooseCache = globalWithMongoose._mongooseCache!;
    mongooseCache.conn = null;
    mongooseCache.promise = null;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
} 
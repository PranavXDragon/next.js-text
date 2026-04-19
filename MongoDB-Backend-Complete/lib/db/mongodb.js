import mongoose from 'mongoose';

// MongoDB connection cached globally to reuse across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with optimized configuration
 * Features:
 * - Connection pooling for better performance
 * - Automatic reconnection on failure
 * - Optimized for Next.js serverless functions
 * - Global caching to prevent duplicate connections
 */
export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('❌ MONGODB_URI environment variable not defined');
    }

    cached.promise = mongoose
      .connect(uri, {
        // Connection pool configuration
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 60000,
        
        // Timeout settings
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        
        // Connection behavior
        retryWrites: true,
        w: 'majority',
      })
      .then((mongoose) => {
        console.log('✅ MongoDB Connected Successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ MongoDB Connection Failed:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

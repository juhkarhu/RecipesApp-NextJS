import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!; // Ensure this is defined in your .env file

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local',
  );
}

// Use a module-level cache instead of a global one
const cached = {
  conn: null as mongoose.Mongoose | null,
  promise: null as Promise<mongoose.Mongoose> | null,
};

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
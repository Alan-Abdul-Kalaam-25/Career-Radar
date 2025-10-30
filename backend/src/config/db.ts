import mongoose from 'mongoose';

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  mongoose.set('strictQuery', true);
  return mongoose.connect(uri);
}



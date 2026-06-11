import mongoose from 'mongoose';

export default async () => {
  await mongoose.disconnect();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mongod = (globalThis as any).__MONGOD__;
  if (mongod) {
    await mongod.stop();
  }
};

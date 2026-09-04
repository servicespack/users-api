import mongoose from 'mongoose'

export default async () => {
  await mongoose.disconnect()
  const mongod = (globalThis as any).__MONGOD__
  if (mongod) {
    await mongod.stop()
  }
}

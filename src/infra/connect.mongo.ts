import * as mongoose from 'mongoose'

export const connectMongo = async (connectString: string, dbName: string) => {
  try {
    await mongoose.connect(connectString, { dbName })
    console.log('Connected', connectString)
  } catch (e) {
    console.error('connectMongo', e)
    process.exit(1)
  }
}

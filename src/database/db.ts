import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';

export function initDb(url?: string) {
    console.log('Connecting to MongoDB', url ?? process.env.MONGO_URL ?? '');
    return mongoose.connect(url ?? process.env.MONGO_URL ?? '');
}

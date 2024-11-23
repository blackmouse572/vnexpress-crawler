import mongoose, { Schema } from 'mongoose';

const NEWS_COLLECTION = 'News';

const NewsSchema = new Schema(
    {
        title: String,
        url: { type: String, unique: true },
        label: String,
        description: String,
    },
    {
        timestamps: true,
    }
);

const NewsDocument = mongoose.model(NEWS_COLLECTION, NewsSchema);

export { NEWS_COLLECTION, NewsDocument, NewsSchema };

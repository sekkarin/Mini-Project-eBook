import * as mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  authorWebsite: {
    type: String,
    trim: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true,
  },
  ISBN: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  coverImage: {
    type: String,
    trim: true,
  },
  bookFile: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

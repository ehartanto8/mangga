import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: String,
    author: String,
    contents: String,
    tags: [String],
  },
  { timestamps: true },
)

export const Post = mongoose.model('post', postSchema)

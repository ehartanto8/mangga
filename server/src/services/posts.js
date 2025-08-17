import { Post } from '../db/models/post.js'

export async function createPost({ title, author, contents, tags }) {
  const post = new Post({ title, author, contents, tags })

  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {}
){
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

// All Posts
export async function listAllPosts(options){
  return await listPosts({}, options)
}

// Authors
export async function listPostsByAuthor(author, options){
  return await listPosts({ author }, options)
}

// Tags
export async function listPostsByTag(tags, options){
  return await listPosts({ tags }, options)
}

// Get Post by Id
export async function getPostById(postId) {
  return await Post.findById(postId)
}

// Update Post
export async function updatePost(postId, { title, author, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, contents, tags }},
    { new: true }
  )
}

// Delete
export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}

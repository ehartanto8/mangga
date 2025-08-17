import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import { createPost, listAllPosts, listPostsByAuthor, listPostsByTag, getPostById } from '../../server/src/services/posts.js'
import { Post } from '../../server/src/db/models/post.js'

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      author: 'Daniel Bugl',
      contents: 'This post is stored in a Mongoose database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost(post)

    expect(createdPost.__id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost.__id)

    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const post = {
      author: 'Daniel Bugl',
      contents: 'Post with no title',
      tags: ['empty'],
    }

    try {
      await createPost(post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }
    const createdPost = await createPost(post)
    expect(createdPost.__id).toBeInstanceOf(mongoose.Types.ObjectId)
  })

  const samplePosts = [
    { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
    { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
    { title: 'Full Stack React Projects', author: 'Daniel Bugl', tags:['react', 'nodejs'] },
    { title: 'Guide to TypeScript' }
  ]

  let createdSamplePosts = []
  beforeEach(async () => {
    await Post.deleteMany({})
    createdSamplePosts = []
    for (const post of samplePosts){
      const createdPost = new Post(post)
      createdSamplePosts.push(await createdPost.save())
    }
  })

  describe('listing posts', () => {
    test('should return all posts', async () => {
      const posts = await listAllPosts()
      expect(posts.length).toEqual(createdSamplePosts.length)
    })
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort((a, b) => b.createdAt - a.createdAt)
    expect (posts.map((post) => post.createdAt)).toEqual(sortedSamplePosts.map((post) => post.createdAt))
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending'
    })

    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt
    )

    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt)
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('Daniel Bugl')
    expect(posts.length).toBe(3)
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })

  describe('getting a post', () => {
    test('should return the full post', async () => {
      const post = await getPostById(createdSamplePosts[0].__id)
      expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
    })
    test('should fail if the id does not exist', async () => {
      const post = await getPostById('0000000000000000000000')
      expect(post).toEqual(null)
    })
  })
})

const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  console.log('entered a test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  console.log('entered a test')
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('specific blog is within the returned blogs', async () => {
  console.log('entered test')
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain(
    'How to be Jesus Christ'
  )
})

test('a valid blog can be added', async () => {
  console.log('entered a test')
  const newBlog = {
    title: 'This is all valid',
    author: 'This is valid',
    url: 'link',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'How to be Jesus Christ'
  )
})

// test('an invalid blog can not be added', async () => {
//   console.log('entered a test')
//   const newBlog = {
//     title: 'This is invalid'
//   }
//
//   await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(400) 
//
//   const blogsAtEnd = helper.blogsInDb()
//   expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
// })

test('a specific blog can be view', async () => {
  console.log('entered a test')
  const blogsAtStart = await helper.blogsInDb() 

  const blogToView = blogsAtStart[0]
  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultBlog.body).toEqual(blogToView)
})

test('a blog can be deleted', async () => {
  console.log('entered a test')
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

afterAll(async () => {
  await mongoose.connection.close()
})


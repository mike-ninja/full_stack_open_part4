/* These are the route handlers. The event handlers of routes
 * are commonly referred to as controllers.
*/
// Getting all blogs
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Getting a blog
blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Posting a blog
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body 

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })
  
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', (request, response, next) => {
  const blog = request.body
  console.log(blog)
  // const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  // if (updatedBlog) {
  //   response.json(updatedBlog)
  // } else {
  //   response.status(404).end()
  // }
  Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })  
    .then(updatedBlog => {
      if (updatedBlog) {
        response.json(updatedBlog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = blogsRouter


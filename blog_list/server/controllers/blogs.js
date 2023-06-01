/* These are the route handlers. The event handlers of routes
 * are commonly referred to as controllers.
*/
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog
    .findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)
  console.log(blog)
  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog)
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const blog = request.body
  console.log(blog)
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


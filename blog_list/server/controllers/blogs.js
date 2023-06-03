/* These are the route handlers. The event handlers of routes
 * are commonly referred to as controllers.
*/
// Getting all blogs
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')

// This function has moved to middleware
// const getTokenForm = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
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
  // const decodedToken = jwt.verify(getTokenForm(request), process.env.SECRET)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body
 
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(400).json({ error: 'blog does not belong to user' })
    }
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter


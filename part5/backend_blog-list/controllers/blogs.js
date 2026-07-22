const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 , id: 1 })
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})



blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const body = request.body
    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ?? 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    await savedBlog.populate('user', {
      username: 1,
      name: 1
    })

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})



blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({
        error: 'only the creator can delete this blog'
      })
    }

    await Blog.findByIdAndDelete(request.params.id)

    user.blogs = user.blogs.filter(
      blogId => blogId.toString() !== request.params.id
    )

    await user.save()

    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})


blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  try {
    const updatedBlog = await Blog
      .findByIdAndUpdate(
        request.params.id,
        blog,
        {
          new: true,
          runValidators: true,
          context: 'query'
        }
      )
      .populate('user', {
        username: 1,
        name: 1
      })

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})


module.exports = blogsRouter
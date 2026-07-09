const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'https://example.com/clean-code',
    likes: 10,
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt and David Thomas',
    url: 'https://example.com/pragmatic-programmer',
    likes: 15,
  },
]

let token
let user

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  })

  await user.save()

  const blogObjects = initialBlogs.map(blog =>
    new Blog({
      ...blog,
      user: user._id,
    })
  )

  const savedBlogs = await Promise.all(blogObjects.map(blog => blog.save()))

  user.blogs = savedBlogs.map(blog => blog._id)
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret',
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  token = loginResponse.body.token
})

test('blogs are returned as JSON with the correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs have id instead of _id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blog = response.body[0]

  expect(blog.id).toBeDefined()
  expect(blog._id).not.toBeDefined()
})

test('addition of a new blog succeeds with a valid token', async () => {
  const newBlog = {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    url: 'https://example.com/javascript-good-parts',
    likes: 8,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const titles = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain('JavaScript: The Good Parts')
})

test('addition of a new blog fails with status 401 if token is not provided', async () => {
  const newBlog = {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    url: 'https://example.com/javascript-good-parts',
    likes: 8,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  expect(response.body.error).toBeDefined()

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(initialBlogs.length)
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    url: 'https://example.com/javascript-good-parts',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

describe('creation of a blog with invalid data', () => {
  test('fails with status 400 if title is missing', async () => {
    const newBlog = {
      author: 'Douglas Crockford',
      url: 'https://example.com/javascript-good-parts',
      likes: 3,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBeDefined()
  })

  test('fails with status 400 if url is missing', async () => {
    const newBlog = {
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      likes: 3,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBeDefined()
  })
})

test('a blog can be deleted with a valid token', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

  const titles = blogsAtEnd.map(blog => blog.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('likes of a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const newLikes = 20

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: newLikes })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(newLikes)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  expect(updatedBlog.likes).toBe(newLikes)
})

afterAll(async () => {
  await mongoose.connection.close()
})
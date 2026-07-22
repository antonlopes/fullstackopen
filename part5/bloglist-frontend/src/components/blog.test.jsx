import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Blog from './Blog'
import CreateForm from './CreateForm'

describe('Blog component', () => {
  test('renders the blog title and author while keeping the details hidden by default', () => {
    const blog = {
      title: 'Clean Code',
      author: 'Robert Martin',
      url: 'www.cleancode.com',
      likes: 10
    }

    const { container } = render(<Blog blog={blog} />)

    const summary = container.querySelector('.blog-summary')
    const details = container.querySelector('.blog-details')

    expect(summary).toHaveTextContent('Clean Code')
    expect(summary).toHaveTextContent('Robert Martin')
    expect(details).toHaveStyle('display: none')
  })

  test('reveals the blog URL and number of likes when the Show button is clicked', async () => {
    const blog = {
      title: 'Clean Code',
      author: 'Robert Martin',
      url: 'www.cleancode.com',
      likes: 10,
      user: {
        username: 'robertmartin',
        name: 'Robert Martin'
      }
    }

    const handleLike = vi.fn()
    const handleRemove = vi.fn()
    const user = userEvent.setup()

    const { container } = render(
      <Blog
        blog={blog}
        user={blog.user}
        handleLike={handleLike}
        handleRemove={handleRemove}
      />
    )

    const showButton = screen.getByRole('button', { name: 'Show' })
    await user.click(showButton)

    const blogDetails = container.querySelector('.blog-details')

    expect(blogDetails).not.toHaveStyle('display: none')
    expect(blogDetails).toHaveTextContent('www.cleancode.com')
    expect(blogDetails).toHaveTextContent('likes 10')
  })

  test('calls handleLike twice when the like button is clicked twice', async () => {
    const blog = {
      title: 'Clean Code',
      author: 'Robert Martin',
      url: 'www.cleancode.com',
      likes: 10,
      user: {
        username: 'robertmartin',
        name: 'Robert Martin'
      }
    }

    const handleLike = vi.fn()
    const handleRemove = vi.fn()
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={blog.user}
        handleLike={handleLike}
        handleRemove={handleRemove}
      />
    )

    const showButton = screen.getByRole('button', { name: 'Show' })
    await user.click(showButton)

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLike).toHaveBeenCalledTimes(2)
  })
})

describe('CreateForm component', () => {
  test('submits the entered blog details through createBlog', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<CreateForm createBlog={createBlog} />)

    const createButton = screen.getByRole('button', { name: 'create new blog' })
    const titleInput = screen.getByPlaceholderText(/title/)
    const authorInput = screen.getByPlaceholderText(/author/)
    const urlInput = screen.getByPlaceholderText(/url/)

    await user.type(titleInput, 'Clean Code')
    await user.type(authorInput, 'Robert Martin')
    await user.type(urlInput, 'www.cleancode.com')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Clean Code')
    expect(createBlog.mock.calls[0][0].author).toBe('Robert Martin')
    expect(createBlog.mock.calls[0][0].url).toBe('www.cleancode.com')
  })
})
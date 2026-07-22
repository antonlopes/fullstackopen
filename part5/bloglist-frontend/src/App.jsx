import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import Togglable from './components/Togglable'
import CreateForm from './components/CreateForm'


const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()


  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])




  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotificationMessage({
        message: 'wrong username or password',
        type: 'error'
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken(null)
    setUser(null)
    setNotificationMessage(null)
  }


  const handleSubmit = async (blogObject) => {
    try {

      const createdBlog = await blogService.create(blogObject)
      setBlogs(prevBlogs =>
        prevBlogs.concat(createdBlog))
      blogFormRef.current?.toggleVisibility()

      setNotificationMessage({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'success'
      })

      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      return true
    } catch (error) {
      setNotificationMessage({
        message: error.response?.data?.error || 'failed to create blog',
        type: 'error'
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      return false
    }
  }


  const handleLike = async (blog) => {

    // operador de coalescência nula (nullish coalescing operator)
    const userId =
      blog.user?.id ??
      blog.user?._id ??
      blog.user

    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: (blog.likes ?? 0) + 1,
      user: userId
    }

    try {
      const returnedBlog = await blogService.update(
        blog.id,
        blogToUpdate
      )

      setBlogs(currentBlogs =>
        currentBlogs.map(currentBlog =>
          currentBlog.id !== blog.id
            ? currentBlog
            : returnedBlog
        )
      )
    } catch (error) {
      console.error('Error while adding like:', error)
    }
  }


  const sortedBlogs = [...blogs].sort(
    (blogA, blogB) => (blogB.likes ?? 0) - (blogA.likes ?? 0)
  )


  const removeBlog = async (blog) => {
    const confirmation = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!confirmation) {
      return
    }

    try {
      await blogService.remove(blog.id)

      setBlogs((currentBlogs) =>
        currentBlogs.filter((currentBlog) => currentBlog.id !== blog.id)
      )
    } catch (error) {
      setNotificationMessage({
        message:
          error.response?.data?.error ||
          `Blog "${blog.title}" could not be removed`,
        type: 'error'
      })

      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notificationMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              id="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }


  return (
    <div>
      <h2>blogs</h2>

      <Notification notification={notificationMessage}/>

      <p>{user.name} logged in{' '}
        <button id="logout-button" type="button" onClick={handleLogout}>Logout</button></p>


      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <CreateForm createBlog={handleSubmit} />
      </Togglable>

      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={handleLike}
          handleRemove={removeBlog}
        />
      )}
    </div>
  )
}

export default App
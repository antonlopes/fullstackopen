
import { useState } from 'react'
import PropTypes from 'prop-types'


const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogBelongsToLoggedUser =
    blog.user &&
    user &&
    blog.user.username === user.username


  return (
    <div className="blog" style={blogStyle}>
      <div  style={hideWhenVisible} className="blog-summary">
        {blog.title} {blog.author}

        <button id="showDetails-button" onClick={toggleVisibility}>Show</button>
      </div>
      <div style={showWhenVisible} className="blog-details">
        <div>{blog.title} {blog.author}</div>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button type="button" id="likes-button" onClick={() => handleLike(blog)}>like</button></div>
        <div>{blog.user?.name}</div>
        <div>{blogBelongsToLoggedUser && (
          <button id="remove-button" onClick={() => handleRemove(blog)}>
            remove
          </button>
        )}</div>
        <button type="button" onClick={toggleVisibility}>hide</button>
      </div>
    </div>

  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired
}

export default Blog
import PropTypes from 'prop-types'
import { useState } from 'react'

const CreateForm = ({ createBlog }) => {


  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const handleBlogChange = ({ target }) => {
    const { name, value } = target

    setNewBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const created = await createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })

    if (created) {
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
    }
  }


  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={handleSubmit}>
        <div>
                    title
          <input
            type="text" name="title" value={newBlog.title} id="title" placeholder="title" onChange={handleBlogChange}
          />
        </div>
        <div>
                    author
          <input
            type="text" name="author" value={newBlog.author} id="author" placeholder="author" onChange={handleBlogChange}
          />
        </div>
        <div>
                    url
          <input
            type="text" name="url" value={newBlog.url} id="url" placeholder="url" onChange={handleBlogChange}
          />
        </div>
        <button id="submit-button" type="submit">create new blog</button>
      </form>
    </div>
  )
}


CreateForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default CreateForm



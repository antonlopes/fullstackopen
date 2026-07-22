const dummy = (blogs) => {
  return 1
}


const totalLikes = blogs => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}



const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((mostLiked, blog) => {
    return blog.likes > mostLiked.likes
      ? blog
      : mostLiked
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}



const _ = require('lodash')

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const blogsByAuthor = _.countBy(blogs, 'author')

  const [author, numberOfBlogs] = _.maxBy(
    _.toPairs(blogsByAuthor),
    1
  )

  return {
    author,
    blogs: numberOfBlogs
  }
}



const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = _.map(
    _.groupBy(blogs, 'author'),
    (authorBlogs, author) => {
      return {
        author,
        likes: _.sumBy(authorBlogs, 'likes')
      }
    }
  )

  return _.maxBy(likesByAuthor, 'likes')
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
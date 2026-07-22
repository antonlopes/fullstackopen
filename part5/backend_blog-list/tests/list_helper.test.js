const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})


describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
        _id: '65a422aa71b54a676234d111',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        url: 'https://example.com/clean-code',
        likes: 12,
        __v: 0
    },
    {
        _id: '65a422aa71b54a676234d222',
        title: 'JavaScript: The Good Parts',
        author: 'Douglas Crockford',
        url: 'https://example.com/javascript-good-parts',
        likes: 8,
        __v: 0
    },
    {
        _id: '65a422aa71b54a676234d333',
        title: 'You Don’t Know JS',
        author: 'Kyle Simpson',
        url: 'https://example.com/you-dont-know-js',
        likes: 15,
        __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(40)
  })
})



describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://example.com/go-to',
      likes: 5
    },
    {
      _id: '65a422aa71b54a676234d111',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      url: 'https://example.com/clean-code',
      likes: 12
    },
    {
      _id: '65a422aa71b54a676234d222',
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      url: 'https://example.com/javascript',
      likes: 8
    }
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    expect(result).toEqual({
      title: 'Clean Code',
      author: 'Robert C. Martin',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  const blogs = [
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      url: 'https://example.com/clean-code',
      likes: 10
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      url: 'https://example.com/pragmatic-programmer',
      likes: 8
    },
    {
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      url: 'https://example.com/clean-architecture',
      likes: 15
    },
    {
      title: 'Refactoring',
      author: 'Martin Fowler',
      url: 'https://example.com/refactoring',
      likes: 12
    },
    {
      title: 'Agile Software Development',
      author: 'Robert C. Martin',
      url: 'https://example.com/agile',
      likes: 7
    },
    {
      title: 'Patterns of Enterprise Application Architecture',
      author: 'Martin Fowler',
      url: 'https://example.com/pea',
      likes: 9
    }
  ] 
  

  test('returns the autor with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

describe('most likes', () => {
  const blogs = [
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      url: 'https://example.com/clean-code',
      likes: 10
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      url: 'https://example.com/pragmatic-programmer',
      likes: 8
    },
    {
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      url: 'https://example.com/clean-architecture',
      likes: 15
    },
    {
      title: 'Refactoring',
      author: 'Martin Fowler',
      url: 'https://example.com/refactoring',
      likes: 12
    },
    {
      title: 'Agile Software Development',
      author: 'Robert C. Martin',
      url: 'https://example.com/agile',
      likes: 7
    },
    {
      title: 'Patterns of Enterprise Application Architecture',
      author: 'Martin Fowler',
      url: 'https://example.com/pea',
      likes: 9
    }
  ] 

  test('returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    expect(result).toEqual({
      author: "Robert C. Martin",
      likes: 32
    })
  })

})
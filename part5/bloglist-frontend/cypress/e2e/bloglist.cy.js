
describe('Blog app', function() {

  beforeEach(function() {
    cy.request(
      'POST',
      `${Cypress.env('BACKEND')}/testing/reset`
    )

    const user = {
      name: 'Stanley Kubrick',
      username: 'stanleykubrick',
      password: 'odyssey'
    }

    cy.request(
      'POST',
      `${Cypress.env('BACKEND')}/users`,
      user
    )

    cy.visit('')
  })

  it('Login form is shown by default', function() {
    cy.contains('Log in to application').should('be.visible')
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('stanleykubrick')
      cy.get('#password').type('odyssey')
      cy.get('#login-button').click()

      cy.contains('Stanley Kubrick logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('stanleykubrick')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.contains('Stanley Kubrick logged in').should('not.exist')
    })
  })


  describe('When logged in', function() {
    beforeEach(function() {
      cy.request(
        'POST',
        `${Cypress.env('BACKEND')}/login`,
        {
          username: 'stanleykubrick',
          password: 'odyssey'
        }
      ).then(response => {
        localStorage.setItem(
          'loggedBloglistUser',
          JSON.stringify(response.body)
        )

        cy.visit('')
      })
    })

    it('A blog can be created', function() {
      cy.get('#create-button').click()
      cy.get('#title').type('How Artificial Intelligence Is Changing Cinema')
      cy.get('#author').type('Emma Collins')
      cy.get('#url').type('https://planoepixel.example/ai-in-cinema')
      cy.get('#submit-button').click()
      cy.get('.blog').should('contain', 'How Artificial Intelligence Is Changing Cinema')
      cy.contains(
        'a new blog How Artificial Intelligence Is Changing Cinema by Emma Collins added'
      )
    })


    describe('When a blog exists', function() {

      beforeEach(function() {
        cy.request({
          url: `${Cypress.env('BACKEND')}/blogs`,
          method: 'POST',
          body: {
            title: 'How Artificial Intelligence Is Changing Cinema',
            author: 'Emma Collins',
            url: 'https://planoepixel.example/ai-in-cinema',
            likes: 0
          },
          headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBloglistUser')).token}` }
        })
        cy.visit('')
      })

      it('A blog can be liked', function() {
        cy.contains('How Artificial Intelligence Is Changing Cinema').parent().as('blog')
        cy.get('@blog').contains('Show').click()
        cy.get('@blog').should('contain', 'likes 0')

        cy.get('@blog').contains('like').click()
        cy.get('@blog').should('contain', 'likes 1')
      })


      it('The blog creator can remove the blog', function() {
        cy.contains('How Artificial Intelligence Is Changing Cinema')
          .parent()
          .as('blog')

        cy.get('@blog')
          .contains('Show')
          .click()

        cy.get('@blog')
          .contains('remove')
          .click()

        cy.contains('How Artificial Intelligence Is Changing Cinema')
          .should('not.exist')
      })

      describe('When logged in as another user', function() {
        beforeEach(function() {
          cy.get('#logout-button').click()

          const user = {
            name: 'Antonio Lopes',
            username: 'antoniolopes',
            password: 'arigato'
          }
          cy.request(
            'POST',
            `${Cypress.env('BACKEND')}/users`,
            user
          )

          cy.visit('')


          cy.get('#username').type('antoniolopes')
          cy.get('#password').type('arigato')
          cy.get('#login-button').click()

          cy.contains('Antonio Lopes logged in')
        })


        it('The remove button is not shown to other users', function() {

          cy.contains('How Artificial Intelligence Is Changing Cinema')
            .parent()
            .as('blog')

          cy.get('@blog')
            .contains('Show')
            .click()

          cy.get('@blog')
            .find('#remove-button')
            .should('not.exist')
        })
      })
    })

    describe('When several blogs exist', function() {
      beforeEach(function() {
        cy.request({
          url: `${Cypress.env('BACKEND')}/blogs`,
          method: 'POST',
          body: {
            title: 'How Artificial Intelligence Is Changing Cinema',
            author: 'Emma Collins',
            url: 'https://planoepixel.example/ai-in-cinema',
            likes: 12
          },
          headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBloglistUser')).token}` }
        })
        cy.request({
          url: `${Cypress.env('BACKEND')}/blogs`,
          method: 'POST',
          body: {
            title: '10 Films That Revolutionized Visual Effects',
            author: 'Daniel Brooks',
            url: 'https://cinecircuito.example/films-visual-effects',
            likes: 21
          },
          headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBloglistUser')).token}` }
        })
        cy.request({
          url: `${Cypress.env('BACKEND')}/blogs`,
          method: 'POST',
          body: {
            title: 'The Future of Movie Theaters',
            author: 'Ethan Miller',
            url: 'https://telafutura.example/future-of-movie-theaters',
            likes: 2
          },
          headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBloglistUser')).token}` }
        })
        cy.visit('')

      })

      it('Blogs are ordered by likes in descending order', function() {
        cy.get('.blog').eq(0).should('contain', '10 Films That Revolutionized Visual Effects')
        cy.get('.blog').eq(1).should('contain', 'How Artificial Intelligence Is Changing Cinema')
        cy.get('.blog').eq(2).should('contain', 'The Future of Movie Theaters')
      })
    })
  })
})
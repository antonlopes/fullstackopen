
// const { defineConfig } = require("cypress")

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//     },
//     baseUrl: 'http://localhost:5173',
//   },
//   env: {

//     BACKEND: 'http://localhost:3001/api'
//   }
// })



import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',

    setupNodeEvents(on, config) {
      //...
    },
  },

  env: {
    BACKEND: 'http://localhost:3001/api',
  },
})
const dotenv = require('dotenv')
const validate = require('validate.js')

const result = dotenv.config({
  path: process.env.APP_ENV === 'test' ? '.env.test' : '.env'
})

if (result.error) {
  throw new Error(result.error)
}

const constraints = {
  /**
   * App environment variables constraints
   */
  APP_ENV: {
    presence: true,
    inclusion: ['production', 'development']
  },
  APP_NAME: {
    presence: true,
    length: {
      minimum: 1
    }
  },
  APP_HOST: {
    presence: true
  },
  APP_PORT: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  APP_URL: {
    presence: true,
    url: {
      allowLocal: true
    }
  },
  /**
   * Database environment variables constraints
   */
  DB_CONNECTION: {
    presence: true,
    inclusion: ['mongodb', 'mysql']
  },
  DB_HOST: {
    presence: true
  },
  DB_PORT: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  DB_USER: {
    presence: true
  },
  DB_PASS: {
    presence: true
  },
  DB_NAME: {
    presence: true,
    length: {
      minimum: 2
    }
  },
  /**
   * Token environment variables constraints
   */
  TOKEN_SECRET: {
    presence: true
  },
  TOKEN_EXPIRATION: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  TOKEN_PREFIX: {
    presence: true,
    inclusion: ['Bearer']
  }
}

const errors = validate(process.env, constraints)

if (errors) {
  console.table(errors)
  throw new Error('Erros in environment variables')
}

if (process.env.APP_ENV === 'production') {
  process.env = Object.freeze({...process.env})
}

module.exports = result

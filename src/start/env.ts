import validate from 'validate.js'

const constraints = {
  /**
   * App environment variables constraints
   */
  APP_ENV: {
    presence: true,
    inclusion: ['production', 'development', 'testing']
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
  DB_MONGODB_URL: {},
  DB_MYSQL_HOST: {},
  DB_MYSQL_PORT: {
    numericality: {
      onlyInteger: true,
      greaterThan: 0
    }
  },
  DB_MYSQL_USER: {},
  DB_MYSQL_PASS: {},
  DB_MYSQL_NAME: {
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
  throw new Error('Errors in environment variables')
}

if (process.env.APP_ENV === 'production') {
  process.env = Object.freeze({ ...process.env })
}

export default process.env

'use strict'

const { db } = require('../start/')

if (process.env.APP_ENV === 'development') {
  const fs = require('fs')
  const hasha = require('hasha')
  const shell = require('shelljs')

  const md5 = fs.readFileSync('./docs.md5', { encoding: 'utf8' })

  hasha
    .fromFile('./src/docs.apib', {algorithm: 'md5'})
    .then(hash => {
      if (hash !== md5) {
        shell.exec('snowboard html -o docs ./src/docs.apib')

        fs.writeFileSync('docs.md5', hash, { encoding: 'utf8' })
      }

      db.close()
    })
    .catch(console.error)
} else {
  throw new Error('Script only allowed in development')
}

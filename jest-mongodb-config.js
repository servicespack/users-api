module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'db_ubox_testing'
    },
    binary: {
      version: '4.0.3',
      skipMD5: true
    },
    autoStart: false
  }
}

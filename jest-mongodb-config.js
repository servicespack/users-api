export default {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'db_users_api_testing'
    },
    binary: {
      version: '4.0.3',
      skipMD5: true
    },
    autoStart: false
  }
}

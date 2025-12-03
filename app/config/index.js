const auth = require('./auth.config')
const database = require('./db.config')
const redis = require('./redis.config')

module.exports = {
    auth,
    database,
    redis
}
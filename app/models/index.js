const { database, redis } = require('../config')
const redis_client = require('redis')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    database.DB,
    database.USER,
    database.PASSWORD,
    {
        host: database.HOST,
        dialect: database.dialect,
        pool: {
            max: database.pool.max,
            min: database.pool.min,
            acquire: database.pool.min,
            idle: database.pool.idle
        }
    }
)

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('../models/user.model.js')(sequelize, Sequelize)
db.role = require('../models/role.model.js')(sequelize, Sequelize)
db.refreshToken = require('../models/refreshToken.model.js')(sequelize, Sequelize)

// association between Users and Roles is Many-to-Many relationship
db.role.belongsToMany(db.user, {
    through: "user_roles"
})
db.user.belongsToMany(db.role, {
    through: 'user_roles'
})

// association between Users and RefreshToken is One-to-Many relationship
db.user.hasMany(db.refreshToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE' // auto delete all refresh token of a user when user deleting
})

db.refreshToken.belongsTo(db.user)

db.ROLES = ['user', 'admin', 'moderator']

// redis connections
const redisClient = redis_client.createClient({
    socket: {
        host: redis.HOST,
        port: redis.PORT
    },
    password: redis.PASSWORD
})

module.exports = {
    db,
    redisClient
}
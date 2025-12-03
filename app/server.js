// import and initialize neccesary modules and routes, listen for connections
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const { db } = require('./models')
// const rateLimit = require('express-rate-limit')
const { rateLimiter } = require('./middleware')

const app = express()
app.use(morgan('combined'))

// const limiter = rateLimit({
// 	windowMs: 60 * 1000, // 1 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
// 	// standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// 	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
// 	// store: ... , // Redis, Memcached, etc. See below.
// })
// // Apply the rate limiting middleware to all requests.
// app.use(limiter)

app.use(rateLimiter(2, 5))

var corsOptions = {
    // only allow front-end from localhost:8081
    origin: 'http://localhost:8081'
}
app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const PORT = process.env.NODE_DOCKER_PORT | 8080

const Role = db.role
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync DB')
    initial()
})

function initial() {
    Role.create({
        id: 1,
        name: 'user'
    })
    Role.create({
        id: 2,
        name: 'moderator'
    })
    Role.create({
        id: 3,
        name: 'admin'
    })
}

app.get('/', (req, res) => {
    res.send('Welcome!')
})

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
})
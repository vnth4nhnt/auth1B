// import and initialize neccesary modules and routes, listen for connections
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

var corsOptions = {
    // only allow front-end from localhost:8081
    origin: 'http://localhost:8081'
}
app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))

const PORT = process.env.NODE_DOCKER_PORT | 8080

const db = require('./app/models')
const { logger } = require('sequelize/lib/utils/logger')
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
    console.log('GET / route was accessed')
    res.send('Welcome!')
})

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
})
// import and initialize neccesary modules and routes, listen for connections
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const db = require('./models')

const app = express()
app.use(morgan('combined'))

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
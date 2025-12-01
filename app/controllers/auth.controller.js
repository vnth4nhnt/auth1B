// handle signup & signin actions
const db = require('../models')
const config = require('../config/auth.config')
const jwt = require('jsonwebtoken')
// var bcrypt = require('bcryptjs')
const argon2 = require('argon2')

const User = db.user
const Role = db.role

const Op = db.Sequelize.Op
const pepper = process.env.PEPPER

// Configure the algorithm
const options = {
    type: argon2.argon2id,    // Variant of Argon2
    memoryCost: 65536,        // 64 MiB
    timeCost: 2,              // 2 passes
    parallelism: 4,           // 4 threads
    hashLength: 32,           // 32 bytes output
    saltLength: 16,           // 16 bytes salt
    // You can also provide your own salt:
    // salt: crypto.randomBytes(16) 
};

const hashPassword = async (password) => {
    try {
        // hash the password (salt is generated automatically by default)
        const hash = await argon2.hash(password + pepper, options)
        return hash
    } catch (error) {
        console.error('Error hashing password: ',err)
        throw error        
    }
}

const verifyPassword = async (storedHash, providedPassword) => {
    try {
        // the verify function returns true if the password matches
        // it returns false if the password doesn't match
        const isValid = await argon2.verify(storedHash, providedPassword + pepper)
        return isValid
    } catch (error) {
        console.error('Error during password verification: ', error)
        return false
    }
}

exports.signup = async (req, res) => {
    try {
        const passwordHash = await hashPassword(req.body.password)
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: passwordHash
        })
        if (req.body.roles && Array.isArray(req.body.roles) && req.body.roles.length > 0) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            })
            await user.setRoles(roles)
            return res.status(201).send({ message: 'User registered successfully!' })
        } else {
            await user.setRoles([1]);
            return res.status(201).send({ message: "User registered successfully!" })
        }
    } catch (err) {
        console.error("Signup error:", err)
        return res.status(500).send({ 
            message: "Failed to register user",
            error: err.message 
        })
    }
}

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        })

        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            })
        }

        const isValidPassword = await verifyPassword(user.password, req.body.password)
        if (!isValidPassword) {
            return res.status(401).send({
                message: 'Invalid password'
            })
        }

        const accessToken = jwt.sign({id: user.id}, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400
        })
        
        var authorities = []
        const roles = await user.getRoles()
        for (let i = 0; i < roles; i++) {
            authorities.push('ROLE_' + roles[i].name.toUpperCase())
        }
        return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: accessToken
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            message: "Failed to signin",
            error: error.message
        })
    }
}
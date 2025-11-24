// verify Token, check User roles in database

const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')
const db = require('../models')
const User = db.user

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']
    console.log(token)
    if (!token) {
        return res.status(403).send({
            message: 'No token provided!'
        })
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            })
        }
        req.userId = decoded.id 
        next()
    })
}

// isAdmin = (req, res, next) => {
//     User.findByPk(req.userId).then(user => {
//         user.getRoles().then(roles => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].name === 'admin') {
//                     next()
//                     return
//                 }
//             }
//             res.status(403).send({
//                 message: 'Require Admin Role!'
//             })
//             return
//         })
//     })
// }


// isModerator = (req, res, next) => {
//     User.findByPk(req.userId).then(user => {
//         user.getRoles().then(roles => {
//             for (let i=0; i < roles.length; i++) {
//                 if (roles[i].name === 'moderator') {
//                     next()
//                     return
//                 }
//             }

//             res.status(403).send({
//                 message: 'Require Moderator Role!'
//             })
//             return
//         })
//     })
// }

// isModeratorOrAdmin = (req, res, next) => {
//     User.findByPk(req.userId).then(user => {
//         user.getRoles().then(roles => {
//             for (let i=0; i < roles.length; i++) {
//                 if (roles[i].name === 'moderator') {
//                     next()
//                     return
//                 }

//                 if (roles[i].name === 'admin') {
//                     next()
//                     return
//                 }
//             }

//             res.status(403).send({
//                 message: 'Require Moderator or Admin Role!'
//             })
//         })
//     })
// }

// using async/await instead.

isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId)
        if (!user) {
            return res.status(404).send(
                {
                    message: "User not found!"
                }
            )
        }

        const roles = await user.getRoles()
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'admin') {
                return next()
            }
        }
        return res.status(403).send({ message: 'Require Admin Role!' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

isModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId)
        if (!user) {
            return res.status(404).send(
                {
                    message: "User not found!"
                }
            )
        }

        const roles = await user.getRoles()
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'moderator') {
                return next()
            }
        }
        return res.status(403).send({ message: 'Require Moderator Role!' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

isModeratorOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId)
        if (!user) {
            return res.status(404).send(
                {
                    message: "User not found!"
                }
            )
        }

        const roles = await user.getRoles()
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'moderator') {
                return next()
            }
            if (roles[i].name === 'admin') {
                return next()
            }
        }
        return res.status(403).send({ message: 'Require Moderator Or Admin Role!' })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
}

module.exports = authJwt

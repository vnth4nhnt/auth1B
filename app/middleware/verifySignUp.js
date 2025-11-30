// check duplicate Username or Email
const db = require('../models')
const ROLES = db.ROLES
const User = db.user

// validate signup input later
checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        // check username
        const usernameExist = await User.findOne({
            where: {
                username: req.body.username
            }
        })

        if (usernameExist) {
            return res.status(400).send({
                message: 'Failed! Username is already in use!'
            })
        }

        // check email
        const emailExist = await User.findOne({
            where: { email: req.body.email }
        })

        if (emailExist) {
            return res.status(400).send({
                message: 'Failed! Email is already in use!'
            });
        }

        // if both are ok, next
        return next()

    } catch (err) {
        return res.status(500).send({message: err.message})
    }
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).send({
                    message: 'Failed! Role does not exist = ' + req.body.roles[i]
                })
            }
        }
    }
    return next()
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
}

module.exports = verifySignUp
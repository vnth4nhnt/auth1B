// POST signup & signin

const { verifySignUp, authJwt } = require('../middleware')
const controller = require('../controllers/auth.controller')
const refreshTokenController = require('../controllers/refreshToken.controller')

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    app.post('/api/auth/signup',
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup 
    )

    app.post('/api/auth/signin', controller.signin)
    app.get('/api/auth/logout',
        [authJwt.verifyToken],
        controller.logout
    )
    app.post('/api/auth/refresh', 
        refreshTokenController.refreshToken
    )
}

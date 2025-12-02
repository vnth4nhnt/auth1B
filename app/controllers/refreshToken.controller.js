const db = require('../models')
const config = require('../config/auth.config')
const jwt = require('jsonwebtoken')

const RefreshToken = db.refreshToken

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        
        if (!refreshToken) {
            return res.status(401).send({
                error: "no refresh token provided"
            })
        }

        const isRefreshTokenInDB = await RefreshToken.findOne({
            where: {
                token: refreshToken
            }
        })

        let decoded
        // detect refresh token reuse: is refresh token in DB? 
        if (!isRefreshTokenInDB) {
            // delete all refresh token of hacked user --> force a new login for authentication
            decoded = jwt.verify(refreshToken, config.refresh_secret) 
            const hackedUserId = decoded.id
            await RefreshToken.destroy({
                where: {
                    userId: hackedUserId
                }
            })
            return res.status(403).send({
                message: `User with id=${hackedUserId} is hacked!`
            })
        }

        // evaluate refresh token
        decoded = jwt.verify(refreshToken, config.refresh_secret)
        const newAccessToken = jwt.sign({id: decoded.id}, config.access_secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: "15m"
        })
        
        const newRefreshToken = jwt.sign({id: decoded.id}, config.refresh_secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: "1d"
        })
        
        await RefreshToken.update(
            {
                token: newRefreshToken
            },
            {
                where: {
                    token: refreshToken
                }
            }
        )

        // replace old refresh token
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        return res.status(200).send({
            accessToken: newAccessToken
        })
    } catch (error) {
        return res.status(401).json({error: error})
    }
}
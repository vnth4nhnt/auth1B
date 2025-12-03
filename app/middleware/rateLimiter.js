const { redisClient } = require('../models')

// fixed window counter algorithm
const rateLimiter = (allowedRequests, time) => {
    return async (req, res, next) => {
        try {
            const ip = req.connection.remoteAddress.split(',')[0]
            if (!redisClient.isOpen) {
                await redisClient.connect()
            }
            let ttl
            const requests = await redisClient.incr(ip)
            if (requests === 1) {
                await redisClient.expire(ip, time)
                ttl = time 
            } else {
                ttl = await redisClient.ttl(ip)
            }
            if (requests > allowedRequests) {
                return res.status(429).json({
                    error: 'Too many requests. Try again after sometime. TTL '+ ttl
                })
            }
            return next();
        } catch (error) {
            return res.status(500).json({
                error: error
            })
        }
    }
}

module.exports = rateLimiter
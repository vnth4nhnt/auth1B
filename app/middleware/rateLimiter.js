const { redisClient } = require('../models')

// fixed window counter algorithm
// const rateLimiter = (allowedRequests, time) => {
//     return async (req, res, next) => {
//         try {
//             const ip = req.connection.remoteAddress.split(',')[0]
//             if (!redisClient.isOpen) {
//                 await redisClient.connect()
//             }
//             let ttl
//             const requests = await redisClient.incr(ip)
//             if (requests === 1) {
//                 await redisClient.expire(ip, time)
//                 ttl = time 
//             } else {
//                 ttl = await redisClient.ttl(ip)
//             }
//             if (requests > allowedRequests) {
//                 return res.status(429).json({
//                     error: 'Too many requests. Try again after sometime. TTL '+ ttl
//                 })
//             }
//             return next();
//         } catch (error) {
//             return res.status(500).json({
//                 error: error
//             })
//         }
//     }
// }

const rateLimiter = (options) => {
    const {
        bucketSize = 10,
        refillRate = 1, // tokens per second
        interval = 1000,
    } = options

    return async (req, res, next) => {
        try {
            const ip = req.ip

            if (!redisClient.isOpen) {
                await redisClient.connect()
            }

            const key = `rate-limit:${ip}`
            const  now = Date.now()

            const data = await redisClient.hGetAll(key)

            let tokens = bucketSize
            let lastRefill = now

            if (data.tokens && data.lastRefill) {
                tokens = parseFloat(data.tokens)
                lastRefill = parseInt(data.lastRefill, 10)

                const elapsed = (now - lastRefill) / interval
                tokens = Math.min(bucketSize, tokens + elapsed * refillRate)
            }

            if (tokens < 1) {
                return res.status(429).json({ message: 'Too many requests' })
            }

            tokens -= 1
            await redisClient.hSet(key, {
                tokens: tokens.toString(),
                lastRefill: now.toString()
            })

            return next()
        } catch (error) {
            return res.status(500).json({ error: error })
        }
    }
}


module.exports = rateLimiter
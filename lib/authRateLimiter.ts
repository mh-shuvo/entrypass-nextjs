import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'

const redis = Redis.fromEnv()

export const authRateLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, '1 m'),
    analytics: true,
})
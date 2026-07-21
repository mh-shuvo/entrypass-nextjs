import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'

const redis = Redis.fromEnv()

export const staticRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
})
const jwt = require('jsonwebtoken')

// JWT 鉴权密钥
const JWT_SECRET = 'jXyw*EmvUZ@+G3R8x75n$@prY+zQ8z4^4997BXA9'

// payload 有效负载；expires 到期时间
const JWT = {
  // sign 签名
  sign(payload = {}, expires = 24 * 60 * 60) {
    return jwt.sign(
      // 有效负载
      payload,
      // 秘钥或私钥
      JWT_SECRET,
      // 签署一个有效期为 1 天的令牌
      { expiresIn: expires }
    )
  },

  // verify 验证；校验
  verify(token) {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return false
    }
  },
}

module.exports = JWT

var express = require('express')
var router = express.Router()
/* const JWT = require('../util/JWT')

// 测试 token的 加密与验证过程
const token = JWT.sign({ name: 'mulong' }, '15s')
console.log(JWT.verify(token))
// { name: 'mulong', iat: 1657854949, exp: 1657854964 }

setTimeout(() => {
  console.log(JWT.verify(token))
  // { name: 'mulong', iat: 1657854949, exp: 1657854964 }
}, 10000)

setTimeout(() => {
  console.log(JWT.verify(token))
  // false
}, 16000) */

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router

const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('chat2')
})

module.exports = router

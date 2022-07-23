const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const JWT = require('./util/JWT')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const uploadRouter = require('./routes/upload')
const chatRouter = require('./routes/chat')
const chat2Router = require('./routes/chat2')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 设置中间件，验证 token 是否过期
app.use((req, res, next) => {
  // 排除login相关的路由和接口
  if (req.url.includes('/login')) {
    return next()
  }

  // 如果 authorization 存在就分割
  const token = req.headers['authorization']?.split(' ')[1]
  console.log('token ==> ', token)
  if (token) {
    // 验证 token
    const payload = JWT.verify(token)
    if (payload) {
      // 重新设置token过期时间
      const newToken = JWT.sign(
        {
          _id: payload._id,
          username: payload.username,
        },
        '1d'
      )
      res.header('Authorization', newToken)
      next()
    } else {
      // token过期
      res.status(401).send({ code: 401, msg: '登录过期！' })
    }
  } else {
    next()
  }
})

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use('/upload', uploadRouter)
app.use('/chat', chatRouter)
app.use('/chat2', chat2Router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

const JWT = require('../util/JWT')

function start(server) {
  const io = require('socket.io')(server)

  io.on('connection', socket => {
    // console.log('connection ==> ', socket.handshake)
    console.log('token ==> ', socket.handshake.query.token)

    // 校验token
    const payload = JWT.verify(socket.handshake.query.token)
    if (payload) {
      console.log(payload)
      // 存储用户信息
      socket.userInfo = payload
      // 触发群聊事件
      socket.emit(WebSocketType.GroupChat, createMsg(null, '欢迎来到聊天室...'))
      // 群发在线用户列表
      sendAll(io)
    } else {
      // 触发错误事件
      socket.emit(WebSocketType.Error, createMsg(null, 'token过期...'))
    }

    // 监听断开连接
    socket.on('disconnect', () => {
      // 群发在线用户列表
      sendAll(io)
    })

    // 监听获取用户列表
    socket.on(WebSocketType.GetList, () => {
      // 浏览器控制台输入
      // socket.emit(WebSocketType.GetList)
      // console.log('获取用户列表 ==> ', io.sockets.sockets)
      console.log(
        '获取用户列表01 ==> ',
        Array.from(io.sockets.sockets)
          .map(item => item[1].userInfo)
          .filter(item => item)
      )
    })

    // 监听群聊
    socket.on(WebSocketType.GroupChat, msg => {
      console.log('群聊 ==> ', msg)
      // 群聊 ==>  { user: 'admin', data: '666', to: null, avatar: '/images/默认男头.png' }
      // io.sockets.emit(WebSocketType.GroupChat, createMsg(socket.userInfo, msg.data))

      // 除了自己不发，其他人发
      socket.broadcast.emit(WebSocketType.GroupChat, createMsg(socket.userInfo, msg))
    })

    // 监听私聊
    socket.on(WebSocketType.SingleChat, msg => {
      console.log('私聊 ==> ', msg)
      // 私聊 ==>  { user: 'admin', data: '666', to: '慕龍', avatar: '/images/默认男头.png' }
      Array.from(io.sockets.sockets).forEach(item => {
        if (item[1].userInfo.username === msg.to) {
          item[1].emit(WebSocketType.SingleChat, createMsg(socket.userInfo, msg))
        }
      })
    })
  })
}

// 定义聊天类型
const WebSocketType = {
  Error: 0, // 错误
  GetList: 1, // 获取列表
  GroupChat: 2, // 群聊
  SingleChat: 3, // 私聊
}

// 创建消息
function createMsg(user, data, to, avatar) {
  return {
    user, // 用户名
    data, // 数据内容
    to, // 接收者
    avatar, // 当前用户头像
  }
}

// 群发在线用户列表
function sendAll(io) {
  console.log(
    '获取用户列表02 ==> ',
    Array.from(io.sockets.sockets)
      .map(item => item[1].userInfo)
      .filter(item => item)
  )
  io.sockets.emit(
    WebSocketType.GetList,
    createMsg(
      null,
      Array.from(io.sockets.sockets)
        .map(item => item[1].userInfo)
        .filter(item => item) // 过滤 undefined
    )
  )
}

module.exports = start

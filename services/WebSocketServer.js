const { token } = require('morgan')
const WebSocket = require('ws')
const JWT = require('../util/JWT')

// 创建 WebSocket 服务器
const wss = new WebSocket.WebSocketServer({ port: 8080 })

// 监听连接
wss.on('connection', function connection(ws, req) {
  console.log('url ==> ', req.url)
  const myURL = new URL(req.url, 'http://127.0.0.1:3000')
  // console.log('myURL ==> ', myURL)
  console.log('token ==> ', myURL.searchParams.get('token'))

  // 校验token
  const payload = JWT.verify(myURL.searchParams.get('token'))
  if (payload) {
    console.log(payload)
    // 存储用户信息
    ws.userInfo = payload
    ws.send(createMsg(WebSocketType.GroupChat, ws.userInfo, '欢迎来到聊天室...'))
    // 群发
    sendAll()
  } else {
    ws.send(createMsg(WebSocketType.Error, null, 'token过期...'))
  }

  // 监听消息
  ws.on('message', function message(data) {
    console.log('服务端已收到：%s', data)

    const msgObj = JSON.parse(data)
    console.log('data ==> ', msgObj.data)

    switch (msgObj.type) {
      // 获取列表
      case WebSocketType.GetList:
        // 浏览器控制台输入
        // ws.send(JSON.stringify({type:1}))
        let users = Array.from(wss.clients).map(item => item.userInfo)
        console.log(users)
        ws.send(createMsg(WebSocketType.GetList, null, JSON.stringify(users)))
        break

      // 群聊
      case WebSocketType.GroupChat:
        console.log('群发：', msgObj.data)
        // 服务器广播
        wss.clients.forEach(function each(client) {
          // 客户端的准备状态为打开连接(client 客户端)
          if (client.readyState === WebSocket.OPEN) {
            client.send(createMsg(WebSocketType.GroupChat, ws.userInfo, msgObj.data))
          }
        })
        break

      // 私聊
      case WebSocketType.SingleChat:
        console.log('私聊：', msgObj.data)
        // 服务器广播
        wss.clients.forEach(function each(client) {
          // 客户端的准备状态为打开连接(client 客户端)
          if (client.userInfo.username === msgObj.to && client.readyState === WebSocket.OPEN) {
            client.send(createMsg(WebSocketType.SingleChat, ws.userInfo, msgObj.data))
          }
        })
        break

      default:
        break
    }
  })

  // 监听断开连接
  ws.on('close', () => {
    console.log('有人断开了连接 ==> ', ws.userInfo)
    // 删除当前用户
    wss.clients.delete(ws.userInfo)
    // 群发
    sendAll()
  })
})

const WebSocketType = {
  Error: 0, // 错误
  GetList: 1, // 获取列表
  GroupChat: 2, // 群聊
  SingleChat: 3, // 私聊
}

function createMsg(type, user, data) {
  return JSON.stringify({
    type,
    user,
    data,
  })
}

function sendAll() {
  // 服务器广播
  wss.clients.forEach(function each(client) {
    // 客户端的准备状态为打开连接(client 客户端)
    if (client.readyState === WebSocket.OPEN) {
      let users = Array.from(wss.clients).map(item => item.userInfo)
      client.send(createMsg(WebSocketType.GetList, null, JSON.stringify(users)))
    }
  })
}

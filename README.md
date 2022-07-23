## 项目介绍

- 学习`Node.js`的小项目
  - 主要就是操作`mongodb`数据库，增删改查，上传头像
  - 打造简易的聊天室
  - 前端可以：
    - 注册，登录，修改用户，删除用户
    - 和注册的用户，群聊和私聊

- 项目主体结构

  - 通过应用[express 生成器](https://www.expressjs.com.cn/starter/generator.html)工具： `express-generator` 快速创建的应用骨架

  - 你可以通过 npx （包含在 Node.js 8.2.0 及更高版本中）命令来运行 Express 应用程序生成器。
```sh
# 指定模板引擎与项目名称
npx express-generator --view=ejs myapp

npm i

cd myapp

npm run start

# 访问
http://localhost:3000/
```

- 修改`package.json`，使其修改后，自动重启
```json
{
  "scripts": {
    "start": "nodemon ./bin/www"
  }
}
```

## 启动

```sh
npm i

npm start
```

## 配置服务器

- `config/db.config.js`

```js
const mongoose = require('mongoose')

// 连接数据库 mongodb://用户名:密码@服务器地址:端口/数据库名称
// mongoose.connect('mongodb://test:123456@192.168.240.130:27018/testdb')
mongoose.connect('mongodb://127.0.0.1:27017/test_db')
```

## 图文展示

- 启动服务器可看

### [首页](http://localhost:3000/)
<img src="./public/images/express案例 用户管理.jpg" style="zoom:60%;" />

### [Socket.io 聊天室](http://localhost:3000/chat2)
<img src="./public/images/Socket.io 聊天室.jpg" style="zoom:60%;" />

### [WebSocket 聊天室](http://localhost:3000/chat)
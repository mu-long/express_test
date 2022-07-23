const UserService = require('../services/UserService')
const JWT = require('../util/JWT')

const UserController = {
  addUser: async (req, res) => {
    console.log(req.body)
    // { username: 'admin', password: '123', age: '18' }
    const { username, password, age } = req.body
    // 上传头像就使用，没有就用默认头像
    const avatar = req.file ? `/uploads/${req.file.filename}` : '/images/默认男头.png'
    console.log('req.file ==> ', req.file)
    // 向数据库，添加数据
    const data = await UserService.addUser(username, password, age, avatar)
    console.log(data)
    res.send({ code: 200, mse: '注册成功！' })
  },

  updateUser: async (req, res) => {
    console.log(req.body, req.params)
    // { username: 'admin', password: '123', age: '18' }
    const { username, password, age } = req.body
    // 上传头像就使用，没有就用默认头像
    const avatar = req.file ? `/uploads/${req.file.filename}` : '/images/默认男头.png'
    console.log('req.file ==> ', req.file)
    // 更新数据
    const data = await UserService.updateUser(username, password, age, avatar)
    console.log(data)
    res.send({ code: 200, mse: '更新数据成功！' })
  },

  deleteUser: async (req, res) => {
    console.log(req.params)

    // 删除数据
    const data = await UserService.deleteUser(req.params.name)
    console.log(data)
    res.send({ code: 200, mse: '删除数据成功！' })
  },

  getUserList: async (req, res) => {
    console.log(req.query)
    const { page, limit } = req.query
    // 查询数据库 进行排序，分页，过滤 只返回 uaurname,age字段
    const data = await UserService.getUserList(page, limit)
    console.log(data)
    res.send({ code: 200, data })
  },

  login: async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body
    const data = await UserService.login(username, password)
    console.log('登录 data ==> ', data)
    /* 登录 data ==>  [
      {
        _id: new ObjectId("62cd3c0e74f16c9d44b07daa"),
        username: 'test',
        password: '123',
        age: 18,
        __v: 0
      }
    ] */
    if (data.length === 0) {
      res.send({
        code: 400,
        msg: '登录失败！用户名与密码不匹配...',
      })
    } else {
      // 设置token
      const token = JWT.sign(
        {
          _id: data[0]._id,
          username: data[0].username,
        },
        '1h'
      )
      // token返回在header
      res.header('Authorization', token)

      res.send({
        code: 200,
        msg: '登录成功！',
        data: data[0],
        token,
      })
    }
  },

  logout: (req, res) => {
    res.send({ code: 401, msg: '登录过期！' })
  },
}

module.exports = UserController

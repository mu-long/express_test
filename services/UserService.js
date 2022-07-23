const UserModel = require('../model/UserModel')

const UserService = {
  addUser: (username, password, age, avatar) => {
    return UserModel.create({
      username,
      password,
      age,
      avatar,
    })
  },

  updateUser: (username, password, age, avatar) => {
    return UserModel.updateOne(
      { username },
      {
        username,
        password,
        age,
        avatar,
      }
    )
  },

  deleteUser: username => {
    return UserModel.deleteOne({ username })
  },

  getUserList: (page, limit) => {
    return UserModel.find({}, ['username', 'age', 'avatar'])
      .sort({ age: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
  },

  login: (username, password) => {
    // 查询匹配的用户，不返回密码信息
    return UserModel.find({ username, password }, { password: 0 })
  },
}

module.exports = UserService

const mongoose = require('mongoose')

// Schema 模式
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  age: Number,
  avatar: String,
})

// 创建一个模型(user，限制 字段类型), 一一对应数据库的集合(users)
// UserModel模型 将会对应 users 集合
const UserModel = mongoose.model('users', userSchema)

module.exports = UserModel

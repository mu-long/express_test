const mongoose = require('mongoose')

// 连接数据库 mongodb://用户名:密码@服务器地址:端口/数据库名称
// mongoose.connect('mongodb://test:123456@192.168.240.130:27018/testdb')
mongoose.connect('mongodb://127.0.0.1:27017/test_db')

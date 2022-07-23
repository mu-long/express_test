const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'public/uploads/' })
const router = express.Router()
const UserController = require('../controllers/UserController')

// 添加数据
router.post('/', upload.single('avatar'), UserController.addUser)

// 更新
router.put('/:name', upload.single('avatar'), UserController.updateUser)

// 删除
router.delete('/:name', UserController.deleteUser)

// 获取列表
router.get('/', UserController.getUserList)

// 登录校验
router.post('/login', UserController.login)

// 退出登录
router.get('/logout', UserController.logout)

module.exports = router

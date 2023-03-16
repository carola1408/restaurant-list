//建立專案總路由器
const express = require('express') // 引用 Express 與 Express 路由器
const router = express.Router() // 準備引入路由模組
//加入一條「登入表單頁面」的路由
router.get('/login', (req, res) => {
  res.render('login')
})
//匯出路由模組
module.exports = router
//封裝 home 模組
const express = require('express') // 引用 Express 與 Express 路由器
const router = express.Router() // 準備引入路由模組
const passport = require('passport') // 載入 passport
//使用者使用畫面上facebook按鍵的按鈕
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))
//facebook完成驗證後呼叫我們路由
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))


// 匯出路由器
module.exports = router

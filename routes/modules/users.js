//建立專案總路由器
const express = require('express') // 引用 Express 與 Express 路由器
const router = express.Router() // 準備引入路由模組
const User = require('../../models/user') // 準備引入User model模組
const passport = require('passport') // 引用 passport
const bcrypt = require('bcryptjs') //引用 bcrypt

//加入一條「登入表單頁面」的路由
router.get('/login', (req, res) => {
  res.render('login')
})
// 加入 middleware，驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))
//加入一條「使用者登入註冊頁面」的路由
router.get('/register', (req, res) => {
  res.render('register')
})
//加入一條「註冊功能」和處理多個 flash message的路由
router.post('/register', (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '除了 name 所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then(user => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
      .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
      // 如果還沒註冊：寫入資料庫
      .then(hash => User.create({
        name,
        email,
        password: hash // 用雜湊值取代原本的使用者密碼
      }))

      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

//加入一條「使用者登出頁面」的路由
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})


// 匯出路由器
module.exports = router
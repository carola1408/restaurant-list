const passport = require('passport') // 載入 passport
const LocalStrategy = require('passport-local').Strategy //載入 LocalStrategy模組
const User = require('../models/user') // 載入 User model
const bcrypt = require('bcryptjs') //引用 bcrypt
const FacebookStrategy = require('passport-facebook').Strategy // 引用 Facebook 登入策略

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { type: 'warning_msg', message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { type: 'warning_msg', message: 'Email or Password incorrect.' })
            }
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      User.findOne({ email })
        .then(user => {
          if (user) return done(null, user)
          //從36個英文字母和數字組成的字串中隨機取出只取後面8位數字,做成隨機密碼(A~Z, 0~9)
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
            .then(salt => bcrypt.hash(randomPassword, salt)) // 為使用者密碼「加鹽」，產生雜湊值
            // 如果還沒註冊：寫入資料庫
            .then(hash => User.create({
              name,
              email,
              password: hash // 用雜湊值取代原本的使用者密碼
            }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
    }));
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
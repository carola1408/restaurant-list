// 載入 express 並建構應用程式伺服器
const express = require('express')
const session = require('express-session') // 載入 session 
const exphbs = require('express-handlebars') // require express-handlebars 
const bodyParser = require('body-parser')  // 引用 body-parser
const methodOverride = require('method-override') // 載入 method-override
const flash = require('connect-flash') // 引用 connect-flash
const routes = require('./routes')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const usePassport = require('./config/passport') // 載入 passport
require('./config/mongoose')

const app = express()
const port = process.env.PORT  // 定義要使用連接埠號(port number) 
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

//使用 app.use() 註冊套件，並使用 session(option) 來設定相關選項
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))
// 呼叫 Passport 函式並傳入 app
usePassport(app)
app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  next()
})
app.use(routes)


//啟動並監聽伺服器 Listen the server when it started
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
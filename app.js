// 載入 express 並建構應用程式伺服器
const express = require('express')
const port = 3000 // 定義要使用連接埠號(port number) 
const exphbs = require('express-handlebars') // require express-handlebars 
const restaurantList = require('./restaurant.json') // 載入 JSON
const bodyParser = require('body-parser')  // 引用 body-parser
const methodOverride = require('method-override') // 載入 method-override
const routes = require('./routes')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')

const app = express()
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

app.use(routes)


//啟動並監聽伺服器 Listen the server when it started
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
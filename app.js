// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const app = express()
const port = 3000 // 定義要使用連接埠號(port number) 
const exphbs = require('express-handlebars') // require express-handlebars 
const restaurantList = require('./restaurant.json') // 載入 JSON

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// 設定首頁路由
app.get('/', (req, res) => {
  // pass the restaurant data into 'index' partial template
  res.render('index', { restaurants: restaurantList.results })

})

//應用 params 打造動態路由
app.get('/:restaurants_id', (req, res) => {
  const restaurants = restaurantList.results.find(restaurants => restaurants.id.toString() === req.params.restaurants_id)
  res.render('show', { restaurants: restaurants })
})

//啟動並監聽伺服器 Listen the server when it started
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
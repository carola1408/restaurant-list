// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const app = express()
const port = 3000 // 定義要使用連接埠號(port number) 
const exphbs = require('express-handlebars') // require express-handlebars 
const restaurantList = require('./restaurant.json') // 載入 JSON
const restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')  // 引用 body-parser

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

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  // pass the restaurant data into 'index' partial template
  res.render('index', { restaurants: restaurantList.results })

})

//設定search路由
app.get('/search', (req, res) => {
  console.log('req keyword', req.query.keyword)
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

//應用 params 打造動態路由
app.get('/:restaurants_id', (req, res) => {
  const restaurants = restaurantList.results.find(restaurants => restaurants.id.toString() === req.params.restaurants_id)
  res.render('show', { restaurants: restaurants })
})

//打造瀏覽所有資料路由
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//打造新增資料路由
app.post('/restaurants', (req, res) => {
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  const restaurants = new restaurant({ name })
  return restaurants.save()
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})
//啟動並監聽伺服器 Listen the server when it started
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
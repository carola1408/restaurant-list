// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
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

//定義要使用連接埠號 (port number)  define server related variables
const port = 3000
// require express-handlebars here 設定在 Express 中使用的樣版引擎
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json') // 載入 JSON

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

app.get('/1', (req, res) => {
  const restaurantOne = {
    id: 1,
    name: '布娜飛比利時啤酒餐廳',
    category: ' 義式餐廳',
    location: '台北市松山區市民大道四段 185 號',
    phone: '02 2570 1255',
    description:
      'Several years after the demise of Jurassic World, a volcanic eruption threatens the remaining dinosaurs on the island of Isla Nublar. Claire Dearing, the former park manager and founder of the Dinosaur Protection Group, recruits Owen Grady to help prevent the extinction of the dinosaurs once again.',
    release_date: '2018-06-06',
    image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5634/08.jpg'
  }
  res.render('show', { restaurants: restaurantOne })
})
//啟動並監聽伺服器 Listen the server when it started
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
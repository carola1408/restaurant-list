// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const app = express()
const port = 3000 // 定義要使用連接埠號(port number) 
const exphbs = require('express-handlebars') // require express-handlebars 
const restaurantList = require('./restaurant.json') // 載入 JSON
const restaurant = require('./models/restaurant') //載入restaurant model
const bodyParser = require('body-parser')  // 引用 body-parser
const methodOverride = require('method-override') // 載入 method-override
const routes = require('./routes')

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

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

app.use(routes)


// //設定search路由
// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword
//   restaurant.find()
//     .lean()
//     .then(restaurants => {
//       return restaurants.filter(restaurant => {
//         if (restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase())) {
//           return true
//         } else if (restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase())) {
//           return true
//         }
//       })
//     })
//     .then((restaurants, keyword) => res.render('index', { restaurants, keyword }))
// })


// //打造瀏覽New頁面路由
// app.get('/restaurants/new', (req, res) => {
//   return res.render('new')
// })

// //將新增的資料存資料庫
// app.post('/restaurants', (req, res) => {
//   const id = req.body.id
//   const name = req.body.name
//   const name_en = req.body.name_en
//   const category = req.body.category
//   const image = req.body.image
//   const location = req.body.location
//   const phone = req.body.phone
//   const google_map = req.body.google_map
//   const rating = req.body.rating
//   const description = req.body.description
//   // 存入資料庫
//   return restaurant.create({ id, name, name_en, category, image, location, phone, google_map, rating, description })
//     .then(() => res.redirect('/'))
//     .catch(error => console.log(error))

// })

// // 打造資料路由
// app.get('/restaurants/:id', (req, res) => {
//   const id = req.params.id
//   return restaurant.findById(id)
//     .lean()
//     .then((restaurants) => res.render('detail', { restaurants }))
//     .catch(error => console.log(error))
// })

// 打造編輯路由
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// // 控制編輯路由;將post改成put
// app.put('/restaurants/:id', (req, res) => {
//   const id = req.params.id
//   const name = req.body.name
//   const category = req.body.category
//   const location = req.body.location
//   const phone = req.body.phone
//   const google_map = req.body.google_map
//   const rating = req.body.rating
//   const description = req.body.description

//   return restaurant.findById(id)
//     .then(restaurant => {
//       restaurant.name = name
//       restaurant.category = category
//       restaurant.location = location
//       restaurant.phone = phone
//       restaurant.google_map = google_map
//       restaurant.rating = rating
//       restaurant.description = description
//       return restaurant.save()
//     })
//     .then(() => res.redirect(`/${id}`))
//     .catch(error => console.log(error))
// })

// // 打造刪除路由;將post改成delete
// app.delete('/restaurants/:id', (req, res) => {
//   const id = req.params.id //取得網址上的識別碼，用來查詢使用者想刪除的 To-do
//   return restaurant.findById(id) //查詢資料
//     .then(restaurant => restaurant.remove()) //刪除這筆資料
//     .then(() => res.redirect('/')) //重新呼叫首頁
//     .catch(error => console.log(error))
// })

//啟動並監聽伺服器 Listen the server when it started
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
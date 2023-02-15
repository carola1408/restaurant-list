const mongoose = require('mongoose') // 載入mongoose
const restaurant = require('../restaurant') //載入restaurant model
const restaurantList = require('../../restaurant.json').results// 載入 JSON

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫的狀態
const db = mongoose.connection

// 檢查資料快連線狀態，連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 檢查資料快連線狀態，連線正常
//作法一
db.once('open', () => {
  console.log("restaurantSeeder done!")
  restaurant.create(restaurantList)
    .catch(err => {
      console.trace(err)
    })
    .finally(() => {
      db.close()
    })
})

//作法二
// db.once('open', () => {
//   restaurant.create(restaurantList)
//     .then(() => {
//       console.log("restaurantSeeder done!")
//     })
//     .catch(err => console.log(err))
//     .finally(() => db.close())
// })
const bcrypt = require('bcryptjs') //引用 bcrypt
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const restaurant = require('../restaurant') //載入restaurant model
const User = require('../user') // 準備引入User model模組
const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results// 載入 JSON



// 檢查資料快連線狀態，連線正常
//重寫新的種子資料

db.once('open', () => {

})







//作法一
// db.once('open', () => {
//   console.log("restaurantSeeder done!")
//   restaurant.create(restaurantList)
//     .catch(err => {
//       console.trace(err)
//     })
//     .finally(() => {
//       db.close()
//     })
// })

//作法二
// db.once('open', () => {
//   restaurant.create(restaurantList)
//     .then(() => {
//       console.log("restaurantSeeder done!")
//     })
//     .catch(err => console.log(err))
//     .finally(() => db.close())
// })
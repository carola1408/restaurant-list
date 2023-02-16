const restaurant = require('../restaurant') //載入restaurant model
const db = require('../../config/mongoose')

const restaurantList = require('../../restaurant.json').results// 載入 JSON



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
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require("bcryptjs") //引用 bcrypt
const Restaurant = require('../restaurant')  //載入restaurant model
const User = require('../user') // 準備引入User model模組
const db = require('../../config/mongoose')

// 載入 JSON
const restaurantList = require('./restaurant.json').results
const SEED_USERS = [
  {
    name: "user1",
    email: "user1@example.com",
    password: "12345678",
    restaurantIndex: [0, 1, 2],
  },
  {
    name: "user2",
    email: "user2@example.com",
    password: "12345678",
    restaurantIndex: [3, 4, 5],
  },
];

// 檢查資料連線狀態，連線正常;重寫新的種子資料
db.once("open", () => {
  return Promise.all(
    SEED_USERS.map((user) => {
      const { name, email, password, restaurantIndex } = user
      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
        .then((user) => {
          const userId = user._id
          const restaurants = restaurantIndex.map((index) => {
            return { ...restaurantList[index], userId }
          })
          return Restaurant.create(restaurants)
        })
        .catch((error) => console.log(error))
    })
  )
    .then(() => {
      console.log("restaurantSeeder done!")
      process.exit()//關閉這段 Node 執行程序
    })
    .catch((error) => console.log(error))
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



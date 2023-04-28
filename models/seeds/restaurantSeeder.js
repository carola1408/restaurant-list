const bcrypt = require("bcryptjs") //引用 bcrypt
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')  //載入restaurant model
const User = require('../user') // 準備引入User model模組
const db = require('../../config/mongoose')

// 載入 JSON
const restaurantList = require('./restaurant.json').results
const userList = require('./user.json')


// 檢查資料連線狀態，連線正常;重寫新的種子資料
// db.once('open', () => {
//   return Promise.all(
//     SEED_USERS.map((user) => {
//       const { name, email, password, restaurantIndex } = user
//       bcrypt
//         .genSalt(10)// 產生「鹽」，並設定複雜度係數為 10
//         .then(salt => bcrypt.hash(user.password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
//         // 如果還沒註冊：寫入資料庫
//         .then(hash => User.create({
//           name,
//           email,
//           password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//         })
//         )
//         .then(user => {
//           const restaurants = restaurantIndex.map((index) => {
//             const Restaurant = restaurantList[index]
//             Restaurant.userId = user._id
//             return Restaurant
//           })
//           return restaurant.create(restaurants)
//         })
//     }))
//     .then(() => {
//       console.log('restaurantSeeder done!')
//       process.exit() //關閉這段 Node 執行程序
//     })
// })



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


db.once('open', () => {
  Promise.all(
    Array.from(userList, seedUser => {
      return bcrypt
        .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
        .then(salt => bcrypt.hash(seedUser.password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
        // 如果還沒註冊：寫入資料庫
        .then(hash => User.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash
        }))
        .then(user => {
          const userId = user._id
          const restaurant = []

          console.log(seedUser.restaurantIndex)

          Array.from(seedUser.restaurantIndex, index => {
            restaurantList[index].userId = userId
            restaurant.push(restaurantList[index])
          })
          return Restaurant.create(restaurant)
        })
    }))
    .then(() => {
      console.log('restaurantSeeder done!')
      process.exit() //關閉這段 Node 執行程序
    })
    .catch(err => console.log(err))
})
//封裝 home 模組
const express = require('express') // 引用 Express 與 Express 路由器
const router = express.Router() // 準備引入路由模組

const Restaurant = require('../../models/restaurant') // 引用 restaurant model

// 設定首頁home & sort路由模組
// router.get('/', (req, res) => {
//   // pass the restaurant data into 'index' partial template
//   const userId = req.user._id   // 變數設定
//   Restaurant.find({ userId })  // 取出 restaurant model 裡的所有資料
//     .lean()  // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
//     .sort({ _id: 'asc', category: 'desc', location: 'asc' }) // 新增這裡：排序
//     .then((restaurants) => res.render('index', { restaurants })) // 將資料傳給 index 樣板
//     .catch(error => console.log(error)) //錯誤處理

// })

// //設定search路由
// router.get('/search', (req, res) => {
//   const keyword = req.query.keyword

//   Restaurant.find()
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
//     .then((restaurants, keyword,) => res.render('index', { restaurants, keyword, }))
// })


// // 匯出路由器
// module.exports = router
// search & sort
router.get('/', (req, res) => {
  // search & sort
  const keyword = (req.query.keyword) ? req.query.keyword.trim() : ''
  const sort = req.query.sort || 'default'
  const sortBy = {
    default: { _id: 'asc' },
    AtoZ: { name: 'asc' },
    ZtoA: { name: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' }
  }
  const sortSelected = { [sort]: true }
  // user has own foodie list
  const userId = req.user._id

  RestaurantList.find({ userId })
    .lean()
    .sort(sortBy[sort])
    .then(restaurants => {
      const searchResult = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword))

      if (!keyword) {
        res.render('index', { title: 'Foodie Bucket List', restaurants, sortSelected })
      } else {
        res.render('index', { title: 'Foodie Bucket List', restaurants: searchResult, keyword, sortSelected })
      }
    })
    .catch(error => console.log(error))
})

module.exports = router
//封裝 home 模組
const express = require('express') // 引用 Express 與 Express 路由器
const router = express.Router() // 準備引入路由模組

const restaurant = require('../../models/restaurant') // 引用 restaurant model

// 設定首頁home & sort路由模組
router.get('/', (req, res) => {
  // pass the restaurant data into 'index' partial template
  restaurant.find()  // 取出 restaurant model 裡的所有資料
    .lean()  // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ _id: 'asc', category: 'desc', location: 'asc' }) // 新增這裡：排序
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給 index 樣板
    .catch(error => console.log(error)) //錯誤處理

})

//設定search路由
router.get('/search', (req, res) => {
  const keyword = req.query.keyword

  restaurant.find()
    .lean()
    .then(restaurants => {
      return restaurants.filter(restaurant => {
        if (restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase())) {
          return true
        } else if (restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase())) {
          return true
        }
      })
    })
    .then((restaurants, keyword,) => res.render('index', { restaurants, keyword, }))
})


// 匯出路由器
module.exports = router

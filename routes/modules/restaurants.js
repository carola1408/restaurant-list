//設定 todos 路由模組
const express = require('express') // 引用 Express 與 Express 路由器
const router = express.Router() // 準備引入路由模組

const restaurant = require('../../models/restaurant') // 引用 restaurant model

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
    .then((restaurants, keyword) => res.render('index', { restaurants, keyword }))
})


//打造瀏覽New頁面路由
router.get('/new', (req, res) => {
  return res.render('new')
})

//將新增的資料存資料庫
router.post('/', (req, res) => {
  const id = req.body.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  // 存入資料庫
  return restaurant.create({ id, name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

})

// 打造資料路由
router.get('/:id', (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .lean()
    .then((restaurants) => res.render('detail', { restaurants }))
    .catch(error => console.log(error))
})

// 打造編輯路由
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//控制編輯路由; 將post改成put
router.put('/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 打造刪除路由;將post改成delete
router.delete('/:id', (req, res) => {
  const id = req.params.id //取得網址上的識別碼，用來查詢使用者想刪除的 To-do
  return restaurant.findById(id) //查詢資料
    .then(restaurant => restaurant.remove()) //刪除這筆資料
    .then(() => res.redirect('/')) //重新呼叫首頁
    .catch(error => console.log(error))
})
// 匯出路由器
module.exports = router

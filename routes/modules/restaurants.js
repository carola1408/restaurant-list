//設定 todos 路由模組
const express = require('express') // 引用 Express 與 Express 路由器
const router = express.Router() // 準備引入路由模組

const Restaurant = require('../../models/restaurant') // 引用 restaurant model




//打造瀏覽New頁面路由
router.get('/new', (req, res) => {
  return res.render('new')
})

//將新增的資料存資料庫
router.post('/', (req, res) => {
  const userId = req.user._id
  return Restaurant.create({ ...req.body, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 打造資料路由
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurants) => res.render('detail', { restaurants }))
    .catch(error => console.log(error))
})

// 打造編輯路由
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

//控制編輯路由; 將post改成put
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findByIdAndUpdate({ _id, userId }, { ...req.body, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log('error'))
})

// 打造刪除路由;將post改成delete
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id //取得網址上的識別碼，用來查詢使用者想刪除的 To-do
  return Restaurant.findById({ _id, userId }) //查詢資料
    .then(restaurant => restaurant.remove()) //刪除這筆資料
    .then(() => res.redirect('/')) //重新呼叫首頁
    .catch(error => console.log(error))
})
// 匯出路由器
module.exports = router

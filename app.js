// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
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

//定義要使用連接埠號 (port number)  define server related variables
const port = 3000
// require express-handlebars here 設定在 Express 中使用的樣版引擎
const exphbs = require('express-handlebars')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// 設定首頁路由
app.get('/', (req, res) => {
  const restaurantList = [
    {
      id: 1,
      image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5635/01.jpg',
      title: 'Sababa 沙巴巴中東美食',
      category: ' 中東料理',
      rating: 4.1

    },
    {
      id: 2,
      image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5628/02.jpg',
      title: '梅子鰻蒲燒專賣店',
      category: '日本料理',
      rating: 4.3

    },
    {
      id: 3,
      image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5629/03.jpg',
      title: 'ZIGA ZIGA',
      category: '義式餐廳',
      rating: 4.2

    }, {
      id: 4,
      image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5630/04.jpg',
      title: '艾朋牛排餐酒館',
      category: '美式',
      rating: 4.2

    }, {
      id: 5,
      image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5631/05.jpg',
      title: 'Gusto Pizza',
      category: '義式餐廳',
      rating: 4.7

    }, {
      id: 6,
      image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5632/06.jpg',
      title: 'WXYZ Bar店',
      category: '酒吧',
      rating: 4.3

    }, {
      id: 7,
      image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5633/07.jpg',
      title: 'Fika Fika Cafe',
      category: '咖啡',
      rating: 4.3

    }, {
      id: 8,
      image: 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5634/08.jpg',
      title: '布娜飛比利時啤酒餐廳',
      category: '義式餐廳',
      rating: 4.7

    },
  ]

  res.render('index', { restaurants: restaurantList })

})


//啟動並監聽伺服器 Listen the server when it started
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
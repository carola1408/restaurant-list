// 載入 express 並建構應用程式伺服器
const express = require('express')
const app = express()
//定義要使用連接埠號 (port number)  define server related variables
const port = 3000

// 設定首頁路由
app.get('/', (req, res) => {
  res.send('hello world')
})

//啟動並監聽伺服器 Listen the server when it started
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
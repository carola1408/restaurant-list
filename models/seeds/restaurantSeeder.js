const mongoose = require('mongoose')
const restaurant = require('../restaurant') // 載入 restaurant model
const restaurant = require('../../restaurant.json') // 載入 JSON
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 8; i++) {
    restaurant.create({ name: `name-${i}` })
  }
  console.log('done')
})
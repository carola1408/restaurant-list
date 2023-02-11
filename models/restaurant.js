const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  id: {
    type: Number,
  },
  name: {
    type: String, // 資料型別是字串
    require: true // 這是個必填欄位
  },
  name_en: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
  },
  phone: {
    type: Number,
  },
  google_map: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },


})
module.exports = mongoose.model('restaurant', restaurantSchema)
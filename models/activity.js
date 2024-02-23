import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: 'users'
    // required: [true, '缺少使用者']
  },
  name: {
    type: String,
    required: [true, '缺少活動名稱']
  },
  startDate: {
    type: String,
    required: [true, '缺少活動開始日期時間']
  },
  endDate: {
    type: String,
    required: [true, '缺少活動結束日期時間']
  },
  startTime: {
    type: String,
    required: [true, '缺少活動開始日期時間']
  },
  endTime: {
    type: String,
    required: [true, '缺少活動結束日期時間']
  },
  location: {
    type: String,
    required: [true, '缺少活動地點']
  },
  price: {
    type: String
    // required: [true, '缺少活動預算']
  },
  participants: {
    type: Number,
    required: [true, '缺少活動人數']
  },
  category: {
    type: String,
    required: [true, '缺少活動分類'],
    enum: {
      values: ['揪團玩', '揪團行', '揪團買', '揪團住'],
      message: '活動分類錯誤'
    }
  },
  area: {
    type: String,
    required: [true, '缺少地區分類'],
    enum: {
      values: ['北海道', '東北', '關東', '中部', '近畿', '中國', '四國', '九州'],
      message: '地區分類錯誤'
    }
  },
  images: {
    type: [String],
    required: [true, '缺少活動圖片']
  },
  description: {
    type: String,
    required: [true, '缺少活動說明']
  },
  phone: {
    type: String,
    required: [true, '缺少聯絡電話']
  },
  email: {
    type: String,
    required: [true, '缺少聯絡信箱']
  }
  // status: {
  //   type: Boolean,
  //   required: [true, '缺少活動上架狀態']
  // },
  // likeQuantity: {
  //   type: Number,
  //   required: [true, '缺少活動收藏數量']
  // }
}, {
  timestamps: true,
  versionKey: false
})

export default model('activity', schema)

import { Schema, model, ObjectId } from 'mongoose'

const cartSchema = new Schema({
  activity: {
    type: ObjectId,
    ref: 'activity',
    required: [true, '缺少活動欄位']
  },
  quantity: {
    type: Number
    // required: [true, '缺少商品數量']
  }
})

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  date: {
    type: Date,
    default: Date.now()
  },
  cart: {
    type: [cartSchema],
    validate: {
      validator (value) {
        return Array.isArray(value) && value.length > 0
      },
      message: '購物車不能為空'
    }
  }
}, { versionKey: false, timestamps: true })

export default model('orders', schema)

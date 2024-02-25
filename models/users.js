import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import { isNationalIdentificationNumberValid } from 'taiwan-id-validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

const cartSchema = new Schema({
  activity: {
    type: ObjectId,
    ref: 'activity',
    required: [true, '缺少活動欄位']
  },
  quantity: {
    type: Number,
    required: [true, '缺少活動人數']
  }
})

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少使用者姓名'],
    minlength: [2, '使用者姓名長度不符'],
    maxlength: [40, '使用者姓名長度不符']
  },
  birthday: {
    type: Date,
    required: [true, '缺少使用者生日']
  },
  idCard: {
    type: String,
    required: [true, '缺少身分證號碼'],
    unique: true,
    validate: {
      validator (value) {
        // 這裡假設您有一個驗證身分證格式的函數
        // 例如，使用一個自定義函數或第三方庫來驗證
        // 請根據實際情況進行調整
        return isNationalIdentificationNumberValid(value)
      },
      message: '身分證格式錯誤'
    }
  },
  account: {
    type: String,
    required: [true, '缺少使用者帳號'],
    minlength: [4, '使用者帳號長度不符'],
    maxlength: [20, '使用者帳號長度不符'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isAlphanumeric(value)
      },
      message: '使用者帳號格式錯誤'
    }
  },
  phone: {
    type: String,
    required: [true, '缺少手機號碼'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isMobilePhone(value, 'zh-TW')
      },
      message: '手機號碼格式錯誤'
    }
  },
  email: {
    type: String,
    required: [true, '缺少使用者信箱'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  password: {
    type: String,
    required: [true, '缺少使用者密碼']
  },
  tokens: {
    type: [String]
  },
  cart: {
    type: [cartSchema]
  },
  role: {
    type: Number,
    default: UserRole.USER
  }
}, {
  timestamps: true,
  versionKey: false
})

schema.virtual('cartQuantity')
  .get(function () {
    return this.cart.reduce((total, current) => {
      return total + current.quantity
    }, 0)
  })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 4 || user.password.length > 20) {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度不符' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

export default model('users', schema)

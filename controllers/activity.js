import activity from '../models/activity.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    // req.body.images = req.file.path
    // 傳送多張圖片
    req.body.images = req.files.map(file => file.path) // req.file.path
    const result = await activity.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    console.log('controller 收到')
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = parseInt(req.query.sortOrder) || -1
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 20
    const page = parseInt(req.query.page) || 1
    const regex = new RegExp(req.query.search || '', 'i')

    const data = await activity
    // 搜尋關鍵字
      .find({
        $or: [
          { name: regex },
          { location: regex },
          { category: regex },
          { area: regex }
        ]

      })
      // const text = 'a'
      // const obj = { [text]: 1 }
      // obj.a = 1
      .sort({ [sortBy]: sortOrder })
      // 如果一頁 10 筆
      // 第 1 頁 = 0 ~ 10 = 跳過 0 筆 = (1 - 1) * 10
      // 第 2 頁 = 11 ~ 20 = 跳過 10 筆 = (2 - 1) * 10
      // 第 3 頁 = 21 ~ 30 = 跳過 20 筆 = (3 - 1) * 10
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage === -1 ? undefined : itemsPerPage)

    // estimatedDocumentCount() 計算總資料數
    const total = await activity.estimatedDocumentCount()
    console.log('controller: ', data)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const get = async (req, res) => {
  try {
    const data = await activity
      .aggregate([{ $sample: { size: 8 } }]) // 隨機取 8 筆資料

    // countDocuments() 依照 () 內篩選計算總資料數
    const total = await activity.countDocuments()
    console.log('data: ', data)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// export const get = async (req, res) => {
//   try {
//     // 首先使用 $match 筛选 category 为 '揪團玩' 的文档
//     // 然后使用 $sample 随机取 4 筆資料
//     const data = await activity.aggregate([
//       { $match: { category: '揪團玩' } }, // 筛选出 category 为 '揪團玩' 的文档
//       { $sample: { size: 4 } } // 随机选取 4 篇文档
//     ])

//     // countDocuments() 依照 () 内筛选计算总数据数，只计算 category 为 '揪團玩' 的文档
//     const total = await activity.countDocuments({ category: '揪團玩' })
//     console.log('data: ', data)
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: '',
//       result: {
//         data, total
//       }
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: '未知錯誤'
//     })
//   }
// }

export const getId = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    const result = await activity.findById(req.params.id)

    if (!result) throw new Error('NOT FOUND')

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無商品'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const edit = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    // req.body.image = req.file?.path
    req.body.images = req.files.map(file => file.path)
    await activity.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }).orFail(new Error('NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'CastError' || error.message === 'ID') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'ID 格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '查無商品'
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

export const getUserActivities = async (req, res) => {
  try {
    const userId = req.user.id // replace this with how you get the user's ID
    const userActivities = await activity.find({ user: userId })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: userActivities
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// export const getByCategory = async (req, res) => {
//   try {
//     const category = req.params.category // replace this with how you get the category
//     const data = await activity.find({ category }) // find activities in the specified category

//     // countDocuments() 依照 () 內篩選計算總資料數
//     const total = await activity.countDocuments({ category }) // count activities in the specified category
//     console.log('data: ', data)
//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: '',
//       result: {
//         data, total
//       }
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: '未知錯誤'
//     })
//   }
// }

export const getByCategory = async (req, res) => {
  try {
    // 固定category为'揪團玩'
    const category = '揪團玩'
    const data = await activity.find({ category: '揪團玩' }) // 直接指定查询条件

    // countDocuments() 依照 () 內篩選計算總資料數
    const total = await activity.countDocuments({ category: '揪團玩' }) // 直接指定查询条件
    console.log('data: ', data)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getByPlay = async (req, res) => {
  try {
    // 首先使用 $match 筛选 category 为 '揪團玩' 的文档
    // 然后使用 $sample 随机取 4 筆資料
    const data = await activity.aggregate([
      { $match: { category: '揪團玩' } }, // 筛选出 category 为 '揪團玩' 的文档
      { $sample: { size: 9 } } // 随机选取 4 篇文档
    ])

    // countDocuments() 依照 () 内筛选计算总数据数，只计算 category 为 '揪團玩' 的文档
    const total = await activity.countDocuments({ category: '揪團玩' })
    console.log('data: ', data)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getByGo = async (req, res) => {
  try {
    // 首先使用 $match 筛选 category 为 '揪團玩' 的文档
    // 然后使用 $sample 随机取 4 筆資料
    const data = await activity.aggregate([
      { $match: { category: '揪團行' } }, // 筛选出 category 为 '揪團玩' 的文档
      { $sample: { size: 8 } } // 随机选取 4 篇文档
    ])

    // countDocuments() 依照 () 内筛选计算总数据数，只计算 category 为 '揪團玩' 的文档
    const total = await activity.countDocuments({ category: '揪團行' })
    console.log('data: ', data)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getByBuy = async (req, res) => {
  try {
    // 首先使用 $match 筛选 category 为 '揪團玩' 的文档
    // 然后使用 $sample 随机取 4 筆資料
    const data = await activity.aggregate([
      { $match: { category: '揪團買' } }, // 筛选出 category 为 '揪團玩' 的文档
      { $sample: { size: 8 } } // 随机选取 4 篇文档
    ])

    // countDocuments() 依照 () 内筛选计算总数据数，只计算 category 为 '揪團玩' 的文档
    const total = await activity.countDocuments({ category: '揪團買' })
    console.log('data: ', data)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getByHotel = async (req, res) => {
  try {
    // 首先使用 $match 筛选 category 为 '揪團玩' 的文档
    // 然后使用 $sample 随机取 4 筆資料
    const data = await activity.aggregate([
      { $match: { category: '揪團住' } }, // 筛选出 category 为 '揪團玩' 的文档
      { $sample: { size: 8 } } // 随机选取 4 篇文档
    ])

    // countDocuments() 依照 () 内筛选计算总数据数，只计算 category 为 '揪團玩' 的文档
    const total = await activity.countDocuments({ category: '揪團住' })
    console.log('data: ', data)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data, total
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-09 14:28:16
 * @LastEditTime: 2021-05-12 13:41:02
 * @FilePath: /server-api/routes/v1.0/Dmobile/order.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var DB = require('../../../config/db')
var router = express.Router()
var url = require('url')
// 根据用户ID查询未完成的订单
router.get('/query', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let userId = req.query.userId
  let orderId = req.query.orderId
  /*
select  *,if(substring_index(user_reserve_time, ' ',-1) = '08:00:00', concat(substring_index(user_reserve_time, ' ',1), ' 上午' ),concat(substring_index(user_reserve_time, ' ',1), ' 下午' ) ) as reserve_time from v_assign_order where  driver_id = (select driver_id from t_driver_list where wechat_id = ? and driver_is_deleted = 0 limit 0,1) and order_status != 6 and order_id = ? limit 0,1 
*/
  DB.queryDB(
    `select  *,if(substring_index(user_reserve_time, ' ',-1) = '08:00:00', concat(substring_index(user_reserve_time, ' ',1), ' 上午' ),concat(substring_index(user_reserve_time, ' ',1), ' 下午' ) ) as reserve_time from v_assign_order where  driver_id = (select driver_id from t_driver_list where wechat_id = ? and driver_is_deleted = 0 limit 0,1) and order_status != 6  limit 0,1 `,
    [userId, orderId],
    function (error, result, next) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '查询失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '查询成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})
// 根据用户id查询所有的订单
router.get('/queryall', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let userId = req.query.userId === undefined ? 107 : req.query.userId
  console.log(userId)
  DB.queryDB(
    `select  order_id,order_number,user_address,order_size,order_status,order_type,user_reserve_time,driver_name,driver_phone,driver_reach_trash,box_number,if(substring_index(user_reserve_time, ' ',-1) = '08:00:00', concat(substring_index(user_reserve_time, ' ',1), ' 上午' ),concat(substring_index(user_reserve_time, ' ',1), ' 下午' ) ) as reserve_time from v_assign_order where driver_id = (select driver_id from t_driver_list where wechat_id = ? and driver_is_deleted = 0 limit 0,1) order by order_created_time desc`,
    userId,
    function (error, result, next) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '查询失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '查询成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

router.get('/query/ongoing', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let userId = req.query.userId === undefined ? 107 : req.query.userId
  console.log(userId)
  DB.queryDB(
    `select  order_id,order_number,user_address,order_size,order_status,order_type,user_reserve_time,driver_name,driver_phone,driver_reach_trash,box_number,if(substring_index(user_reserve_time, ' ',-1) = '08:00:00', concat(substring_index(user_reserve_time, ' ',1), ' 上午' ),concat(substring_index(user_reserve_time, ' ',1), ' 下午' ) ) as reserve_time from v_assign_order where driver_id = (select driver_id from t_driver_list where wechat_id = ? and driver_is_deleted = 0 limit 0,1) and order_status != 6 order by order_created_time desc`,
    userId,
    function (error, result, next) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '查询失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '查询成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

// 根据车辆ID和司机ID查询信息
router.get('/query/info', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let driver_id = req.query.driverId
  let car_id = req.query.carId
  DB.queryDB(
    'select  a.car_number,b.driver_name,b.driver_phone from  t_car_list as a, t_driver_list as b where a.car_id = ? and b.driver_id = ?',
    [car_id, driver_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '查询失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '查询成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

// 更新订单状态为4，司机前往目的地
router.get('/update/status4', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let order_id = req.query.orderId
  let car_id = req.query.carId
  DB.queryDB(
    'update t_order_list set order_status = 4,car_id = ? where order_id = ? and order_status = 3',
    [car_id, order_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '更新状态失败',
          data: error
        }
        res.send(responseJson)
      } else {
        DB.queryDB(
          'update  t_order_info_list set driver_go_des = now() where  order_id = ?',
          order_id,
          function (error, result, fields) {
            if (error) {
              let responseJson = {
                code: 20002,
                message: '更新时间失败',
                data: error
              }
              res.send(responseJson)
            } else {
              let responseJson = {
                code: 20000,
                message: '更新成功',
                data: result
              }
              res.send(responseJson)
            }
          }
        )
      }
    }
  )
})

// 到达目的地
router.get('/update/reachDes', function (req, res, next) {
  let parseObj = url.parse(req.url, true) // 将URL解析为一个对象
  req.query = parseObj.query
  let order_id = req.query.orderId
  DB.queryDB(
    'update  t_order_info_list set driver_reach_des = now() where  order_id = ?',
    order_id,
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '更新时间失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '更新成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})
// 完成清算
router.post('/update/reachimage', function (req, res, next) {
  let { orderId, reachImageList } = req.body
  DB.queryDB(
    'update t_order_info_list set driver_reach_img = ? , driver_reach_time = now() where  order_id = ?',
    [JSON.stringify(reachImageList), orderId],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '更新时间失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '更新成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

// 完成装运
router.post('/update/getimage', function (req, res, next) {
  let { orderId, getImageList } = req.body
  DB.queryDB(
    'update t_order_info_list set driver_get_img = ? , driver_get_time = now() where  order_id = ?',
    [JSON.stringify(getImageList), orderId],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '更新时间失败',
          data: error
        }
        res.send(responseJson)
      } else {
        // 装车完成订单状态更新为5,运输中
        DB.queryDB(
          'update  t_order_list set order_status = 5 where  order_id = ?',
          orderId,
          function (error, result, fields) {
            if (error) {
              let responseJson = {
                code: 20002,
                message: '更新时间失败',
                data: error
              }
              res.send(responseJson)
            } else {
              let responseJson = {
                code: 20000,
                message: '更新成功',
                data: result
              }
              res.send(responseJson)
            }
          }
        )
      }
    }
  )
})

router.post('/update/reachdes', function (req, res, next) {
  let { orderId } = req.body
  DB.queryDB(
    'update t_order_info_list set driver_reach_trash = now() where  order_id = ?',
    orderId,
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '更新时间失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '更新成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

//订单完成
router.post('/update/complete', function (req, res, next) {
  let { orderId, completeImageList } = req.body
  DB.queryDB(
    'update t_order_info_list set driver_complete_img = ? , driver_complete_time = now() where  order_id = ?',
    [JSON.stringify(completeImageList), orderId],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '更新时间失败',
          data: error
        }
        res.send(responseJson)
      } else {
        // 装车完成订单状态更新为6
        DB.queryDB(
          'update  t_order_list set order_status = 6 where  order_id = ?',
          orderId,
          function (error, result, fields) {
            if (error) {
              let responseJson = {
                code: 20002,
                message: '更新时间失败',
                data: error
              }
              res.send(responseJson)
            } else {
              let responseJson = {
                code: 20000,
                message: '更新成功',
                data: result
              }
              res.send(responseJson)
            }
          }
        )
      }
    }
  )
})
module.exports = router

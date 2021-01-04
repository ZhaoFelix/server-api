var express = require('express')
var DB = require('../../../config/db')
var router = express.Router()

// 测试
router.get('/', function (req, res, next) {
  res.send('mobile driver router respond with a resource')
})

// 获取司机id
router.get('/search', function (req, res, next) {
  DB.queryDB(
    'select * from `t_driver_list` where driver_name = ? and driver_is_deleted = 0',
    [driver_name],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: 'success',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

// 显示所有订单-全部
router.get('/order/query/all', function (req, res, next) {
  let driver_id = req.body.driver_id
  DB.queryDB(
    'select * from `t_order_list` where driver_id = ? and (order_is_deleted = 1 or order_status = 1)',
    [driver_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '查询全部订单失败',
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

// 显示全部订单-已完成
router.get('/order/query/all/finished', function (req, res, next) {
  let driver_id = req.body.driver_id
  DB.queryDB(
    'select * from `t_order_list` where driver_id = ? and order_status = 1',
    [driver_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: 'success',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

// 更新订单状态
router.post('/order/update', function (req, res, next) {
  let order_status = req.body.order_status
  let order_id = req.body.order_id
  // console.log(order_id, order_status)
  DB.queryDB(
    'update `t_order_list` set order_status = ? where order_id = ? and order_is_deleted = 0',
    [order_status, order_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '更新订状态单失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '更新订单状态成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

//确认信息
router.get('/info', function (req, res, next) {
  let driver_id = req.body.driver_id
  DB.queryDB(
    'select * from `t_driver_list` where driver_id = ? and driver_is_deleted = 0',
    [driver_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(responseJson)
      } else {
        var dataString = JSON.stringify(result)
        var data = JSON.parse(dataString)
        console.log(data)
        let { car_id } = data[0]
        DB.queryDB(
          'select * from `t_car_list` where car_id = ? and car_is_deleted = 0',
          [car_id],
          function (error, result, fields) {
            if (error) {
              let responseJson = {
                code: 20002,
                message: 'error',
                data: error
              }
              res.send(responseJson)
            } else {
              let responseJson = {
                code: 20000,
                message: 'success',
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

// 查询车牌号
router.get('/carnumber', function (req, res, next) {
  DB.queryDB(
    'select  car_number,car_id from t_car_list where car_is_deleted = 0;',
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: 'success',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})
module.exports = router

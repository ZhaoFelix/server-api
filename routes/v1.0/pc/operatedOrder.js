/**
 * 订单处理
 * **/

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')

router.get('/driver/query', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let third = query.third
  let sqlStr = third == 0 ? '' : ' where third_id=' + third
  console.log(
    'SELECT driver_name,car_router_type,router_note,driver_id,driver_is_substitutes from t_driver_list' +
      sqlStr
  )
  return new Promise((resolve, reject) => {
    DB.queryDB(
      'SELECT driver_name,driver_id,driver_is_substitutes from t_driver_list' +
        sqlStr,
      function (error, result, fields) {
        if (error) {
          reject('查询信息失败，error:' + error)
        } else {
          resolve(result)
        }
      }
    )
  })
    .then((data) => {
      let responseJson = {
        code: 20000,
        message: 'success',
        data: data
      }
      res.send(responseJson)
    })
    .catch((error) => {
      let responseJson = {
        code: 20002,
        message: 'error',
        data: error
      }
      res.send(responseJson)
    })
})

// TODO:查询实时订单
router.get('/order/query/', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  let third_id = query.third_id
  let sql =
    third_id == 0
      ? 'select  * from v_no_assign_order'
      : 'select  * from v_no_assign_order where third_id = ' + third_id

  // 查询所有未支付和未派发的订单
  DB.queryDB(sql, function (error, result, fields) {
    if (error) {
      let responseJson = {
        code: 20002,
        message: error,
        data: '查询订单失败'
      }
      res.send(responseJson)
    } else {
      let responseJson = {
        code: 20000,
        message: 'sucess',
        data: result
      }
      res.send(responseJson)
    }
  })
})

// 根据路线类型查询车辆
router.get('/car/query', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let router_type = parseInt(query.type)
  return new Promise((resolve, reject) => {
    DB.queryDB(
      'SELECT * from t_car_list where car_router_type = ? and car_id not in (SELECT car_id from t_order_list WHERE order_status = 3 and order_status = 4)',
      [router_type],
      function (error, result, fields) {
        if (error) {
          reject('查询信息失败，error:' + error)
        } else {
          resolve(result)
        }
      }
    )
  })
    .then((data) => {
      let responseJson = {
        code: 20000,
        message: 'success',
        data: data
      }
      res.send(responseJson)
    })
    .catch((error) => {
      let responseJson = {
        code: 20002,
        message: 'error',
        data: error
      }
      res.send(responseJson)
    })
})

// 调度员取消未支付的订单
router.get('/order/cancel', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let order_id = parseInt(query.order_id)
  // 将订单的状态更新为2
  DB.queryDB(
    'update  t_order_list set order_status = 2 where order_id = ? and  order_is_deleted = 0 and order_status = 0',
    [order_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '取消订单失败，请重试！',
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

// 针对订单指派司机和车辆
router.get('/order/assign', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let order_id = parseInt(query.order_id)
  let driver_id = parseInt(query.driver_id)
  // 将订单的状态更新为3
  DB.queryDB(
    'update  t_order_list set order_status = 3, driver_id = ? where order_id = ? and  order_is_deleted = 0 and order_status = 1',
    [driver_id, order_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '指派订单失败，请重试！',
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

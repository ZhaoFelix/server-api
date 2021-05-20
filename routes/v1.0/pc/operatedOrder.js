/**
 * 订单处理
 * **/

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')
var sms = require('../../../utils/sms')
router.get('/driver/query', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let third = query.third
  // let sqlStr =
  //   third == 0
  //     ? ' where driver_id not in (select driver_id from t_order_list  where  driver_id is not  null  and order_status != 6)'
  //     : ' where third_id=' +
  //       third +
  //       ' and driver_id not in (select driver_id from t_order_list  where  driver_id is not  null  and order_status != 6)'
  // console.log(sqlStr)
  let sqlStr = third == 0 ? '' : ' where third_id=' + third
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
      new Result(data, 'success').success(res)
    })
    .catch((error) => {
      new Result(error, 'error').fail(res)
    })
})

// TODO:查询实时订单
router.get('/order/query/', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  let third_id = query.third_id
  let selectRadio = query.selectRadio
  var sql = ''
  if (selectRadio == 0) {
    sql =
      third_id == 0
        ? 'select  * from v_no_assign_order where order_status != 6 order by  order_created_time desc'
        : 'select  * from v_no_assign_order where order_status != 6 and third_id = ' +
          third_id +
          ' order by  order_created_time desc'
  } else if (selectRadio == 1) {
    // 今日订单
    sql =
      third_id == 0
        ? `select  * from v_no_assign_order where order_status != 6  and date_format(order_created_time, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d')  order by  order_created_time desc`
        : `select  * from v_no_assign_order where order_status != 6 and date_format(order_created_time, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') and third_id = ` +
          third_id +
          ' order by  order_created_time desc'
  } else if (selectRadio == 2) {
    // 待指派
    sql =
      third_id == 0
        ? 'select  * from v_no_assign_order where order_status = 1 order by  order_created_time desc'
        : 'select  * from v_no_assign_order where order_status = 1 and third_id = ' +
          third_id +
          ' order by  order_created_time desc'
  } else if (selectRadio == 3) {
    // 进行中
    sql =
      third_id == 0
        ? 'select  * from v_no_assign_order where order_status > 2 and order_status < 6  order by  order_created_time desc'
        : 'select  * from v_no_assign_order where order_status > 2 and order_status < 6 third_id = ' +
          third_id +
          ' order by  order_created_time desc'
  } else if (selectRadio == 4) {
    // 未支付
    sql =
      third_id == 0
        ? 'select  * from v_no_assign_order where order_status = 0 order by  order_created_time desc'
        : 'select  * from v_no_assign_order where order_status = 0 and third_id = ' +
          third_id +
          ' order by  order_created_time desc'
  }

  // 查询所有未支付和未派发的订单
  DB.queryDB(sql, function (error, result, fields) {
    if (error) {
      new Result(error, '查询订单失败').fail(res)
    } else {
      new Result(result, 'success').success(res)
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
      new Result(data, 'success').success(res)
    })
    .catch((error) => {
      new Result(error, 'error').fail(res)
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
        new Result(error, '取消订单失败，请重试').fail(res)
      } else {
        new Result(result, 'success').success(res)
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
        new Result(error, '指派订单失败，请重试！').fail(res)
      } else {
        new Result(result, 'success').success(res)
        // sms.queryDriverAndOrder(order_id, driver_id)
      }
    }
  )
})
module.exports = router

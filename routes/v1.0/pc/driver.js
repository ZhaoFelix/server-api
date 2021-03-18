/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-13 10:37:15
 * @LastEditTime: 2021-03-18 09:03:30
 * @FilePath: /server-api/routes/v1.0/pc/driver.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')
// 查询所有司机的信息
router.get('/query/all', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  DB.queryDB(
    'select  * from t_driver_list  limit ? offset ?',
    [limit, offset],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        DB.queryDB(
          'select count(driver_id) as total from t_driver_list where driver_is_deleted = 0',
          function (error, resu, fields) {
            if (error) {
              new Result(error, '查询记录总条数失败').fail(res)
            } else {
              let responseJson = {
                code: 20000,
                message: 'success',
                total: resu[0].total,
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

router.get('/query/queryByKeyword', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let keyword = query.keyword
  DB.queryDB(
    "select  * from t_driver_list  where driver_phone like '%" +
      keyword +
      "%' and driver_is_deleted = 0",
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

router.get('/query/third', function (req, res, next) {
  DB.queryDB(
    'select  * from t_third_car where third_is_deleted = 0',
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 设置车队队长
router.get('/update/third', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let order_id = query.order_id
  let third_id = query.third_id
  console.log(order_id, third_id)
  DB.queryDB(
    'update  t_order_list set  order_third_id = ? where  order_id = ? and order_status = 1 ',
    [third_id, order_id],
    function (error, result, fields) {
      if (error) {
        new Result(error, '指派车队长失败').fail(res)
      } else {
        new Result(result, '指派车队长成功').success(res)
      }
    }
  )
})

module.exports = router

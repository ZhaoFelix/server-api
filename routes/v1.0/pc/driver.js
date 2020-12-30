/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-13 10:37:15
 * @LastEditTime: 2020-12-30 09:43:28
 * @FilePath: /server-api/routes/v1.0/pc/driver.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')

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
        let responseJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(responseJson)
      } else {
        DB.queryDB(
          'select count(driver_id) as total from t_driver_list where driver_is_deleted = 0',
          function (error, resu, fields) {
            if (error) {
              let responseJson = {
                code: 20002,
                message: '查询记录总条数失败',
                data: error
              }
              res.send(responseJson)
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

router.get('/query/third', function (req, res, next) {
  DB.queryDB(
    'select  * from t_third_car where third_is_deleted = 0',
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

// 设置车队队长
router.get('/update/third', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let order_id = parseObj.order_id
  let third_id = query.third_id
  DB.queryDB(
    'update  t_order_list set  order_third_id = ? where  order_id = ? and order_status = 1 ',
    [third_id, order_id],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: '指派车队长失败',
          data: error
        }
        res.send(responseJson)
      } else {
        let responseJson = {
          code: 20000,
          message: '指派车队长成功',
          data: result
        }
        res.send(responseJson)
      }
    }
  )
})

module.exports = router

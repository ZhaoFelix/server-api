/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-12 10:04:39
 * @LastEditTime: 2021-03-18 09:06:19
 * @FilePath: /server-api/routes/v1.0/pc/estate.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')

// 查询所有物业经理人的信息
router.get('/query/all', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  console.log(parseObj)
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  DB.queryDB(
    'select  * from t_estate_list  where estate_is_deleted = 0 limit ? offset ? ',
    [limit, offset],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        DB.queryDB(
          'select count(estate_id) as total from t_estate_list where estate_is_deleted = 0',
          function (error, resu, fields) {
            if (error) {
              new Result(error, '查询记录条数失败').fail(res)
            } else {
              //  TODO:待修改
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
// 根据手机号查询经理人信息
router.get('/query/queryByKeyword', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let keyword = query.keyword
  DB.queryDB(
    "select  * from t_estate_list  where estate_is_deleted = 0 and estate_phone like '%" +
      keyword +
      "%'",
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})
module.exports = router

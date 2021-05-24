/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-12 10:04:39
 * @LastEditTime: 2021-05-21 10:47:52
 * @FilePath: /server-api/routes/v1.0/pc/estate.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')
const { resolve } = require('path')

// 查询所有物业经理人的信息
router.get('/query/all', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  // console.log(parseObj)
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  DB.queryDB(
    'select  *,if((estate_id in (select  estate_id from t_order_list)),1,0) as is_exist_order from t_estate_list  where estate_is_deleted = 0  order by  estate_created_time desc limit ? offset ? ',
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
// 根据关键字查询经理人信息
router.get('/query/queryByKeyword', function (req, res, next) {
  // 前端传值
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let keyword = query.keyword
  console.log(keyword)
  DB.queryDB(
    "select  *,if((estate_id in (select  estate_id from t_order_list)),1,0) as is_exist_order from t_estate_list  where estate_is_deleted = 0 and concat(estate_phone,estate_name,estate_plot) like '%" +
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

// 删除物业
router.get('/update/delete', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let estate_id = query.estate_id
  DB.queryDB(
    'update  t_estate_list set estate_is_deleted = 1 where estate_id = ?',
    estate_id,
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        // 微信角色类型更新为0
        DB.queryDB(
          'update t_user_list set user_type = 0 where  user_id = (select wechat_id from t_estate_list where estate_id = ?)',
          estate_id,
          function (error, result, fields) {
            if (error) {
            } else {
              new Result(result, '删除成功').success(res)
            }
          }
        )
      }
    }
  )
})

// 更新物业信息
router.get('/update/edit', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  DB.queryDB(
    'update t_estate_list set  estate_name = ? ,estate_phone = ?, estate_company = ?, estate_region = ? ,estate_plot = ? where  estate_id = ? and estate_is_deleted = 0',
    [
      query.estate_name,
      query.estate_phone,
      query.estate_company,
      query.estate_region,
      query.estate_plot,
      query.estate_id
    ],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, '更新成功').success(res)
      }
    }
  )
})

// 添加物业人员信息
router.get('/insert/add', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  DB.queryDB(
    'insert into t_estate_list(estate_name, estate_phone, estate_card_id, estate_gender, estate_company, estate_region, estate_plot, estate_created_time) values (?,?,?,?,?,?,?,now())',
    [
      query.estate_name,
      query.estate_phone,
      query.estate_card_id,
      query.estate_gender,
      query.estate_company,
      query.estate_region,
      query.estate_plot
    ],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, '添加成功').success(res)
        // 添加成功后更新认证状态
        updateEstateStatus(query.estate_phone)
      }
    }
  )
})

function updateEstateStatus(estate_phone) {
  return new Promise((resolve, reject) => {
    DB.queryDB(
      'select  * from t_estate_list where estate_phone = ? and estate_is_auth = 1 and estate_is_deleted = 0',
      estate_phone,
      function (error, result, fields) {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
  })
    .then((data) => {
      if (data.length > 0) {
        let temp = data[0]
        return new Promise((resolve, reject) => {
          DB.queryDB(
            'update  t_estate_list set estate_is_auth = 1 ,wechat_id = ?, estate_wechat_time = now()  where  estate_is_auth = 0 and estate_phone = ?;',
            [temp.wechat_id, estate_phone],
            function (error, result, fields) {
              if (error) {
                reject(error)
              } else {
                resolve(result)
              }
            }
          )
        })
      }
    })
    .then((data) => {
      console.log('更新物业状态成功，info:' + data)
    })
    .catch((error) => {
      console.log('更新物业状态失败，error' + error)
    })
}
module.exports = router

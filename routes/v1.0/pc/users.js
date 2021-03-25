/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-04 15:17:36
 * @LastEditTime: 2021-03-25 09:15:44
 * @FilePath: /server-api/routes/v1.0/pc/users.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var Result = require('../../../utils/result')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

// 分页查询查询微信用户信息
router.get('/query/all', function (req, res, next) {
  let parseObj = url.parse(req.url, true)
  let query = parseObj.query
  let limit = parseInt(query.limit)
  let offset = parseInt(query.offset)
  DB.queryDB(
    'SELECT user_id, wechat_open_id, wechat_nickname,wechat_region,wechat_avatar,wechat_last_time, wechat_phone,user_type,wechat_created_time FROM t_user_list WHERE wechat_is_deleted = 0 order by wechat_created_time desc limit ? offset ?',
    [limit, offset],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        // 查询记录总数
        DB.queryDB(
          'select count(user_id) as total FROM t_user_list WHERE wechat_is_deleted = 0',
          function (error, resu, fields) {
            if (error) {
              new Result(error, '查询记录条数失败').fail(res)
            } else {
              // TODO:待修改
              let respondJson = {
                code: 20000,
                message: 'success',
                total: resu[0].total,
                data: result
              }
              res.send(respondJson)
            }
          }
        )
      }
    }
  )
})

// 删除用户
router.post('/update/delete', function (req, res, next) {
  let id = req.body.user_id
  DB.queryDB(
    'UPDATE `t_user_list` LEFT JOIN `t_user_info_list` ON t_user_list.wechat_id = t_user_info_list.wechat_open_id SET wechat_is_deleted = 1, info_is_deleted = 1 WHERE user_id = ?',
    [id],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

//编辑用户信息
router.post('/update/edit', function (req, res, next) {
  let { user_id, info_adress } = req.body
  DB.queryDB(
    'UPDATE `t_user_info_list` SET info_adress = ? where wechat_id = (SELECT wechat_open_id from `t_user_list` WHERE user_id = ?)',
    [info_adress, user_id],
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

/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-09-02 14:23:14
 * @LastEditTime: 2021-03-18 09:12:13
 * @FilePath: /server-api/routes/v1.0/pc/login.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var md5 = require('md5')
var queryString = require('querystring')
var Result = require('../../../utils/result')

// 登录
router.post('/login', function (req, res, next) {
  let admin_name = req.body.username
  let passwd = md5(req.body.password.toUpperCase())
  DB.queryDB(
    'select admin_token from `t_admin_list` where admin_login_name = ? and  admin_is_deleted = 0 limit 0,1',
    [admin_name],
    function (error, result, fields) {
      if (error) {
        new Result(error, '查询用户名失败').fail(res)
      } else {
        if (result.length == 0) {
          new Result(admin_name, '该用户不存在').fail(res)
        } else {
          DB.queryDB(
            'select admin_token from `t_admin_list` where admin_login_name = ? and admin_pwd = ?  and admin_is_deleted = 0 limit 0,1',
            [admin_name, passwd],
            function (error, result, fields) {
              if (error) {
                new Result(error, '查询密码失败').fail(res)
              } else {
                if (result.length == 0) {
                  new Result('密码不正确', '密码不正确').fail(res)
                } else {
                  new Result(result, 'success').success(res)
                  let admin_token = result[0].admin_token
                  DB.queryDB(
                    'UPDATE `t_admin_list` SET admin_last_time = Now() WHERE admin_token = ?',
                    admin_token,
                    function (error, result, fields) {
                      if (error) {
                        console.log('更新失败' + error)
                      } else {
                        console.log('更新成功')
                      }
                    }
                  )
                }
              }
            }
          )
        }
      }
    }
  )
})

// 根据token获取用户信息
router.get('/info', function (req, res, next) {
  let arg = url.parse(req.url).query
  let params = queryString.parse(arg)
  let token = params.token
  DB.queryDB(
    'select admin_name,admin_id,admin_type,admin_third_id from `t_admin_list` where admin_token = ? and admin_is_deleted = 0 limit 0,1',
    [token],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'token不存在').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 用户登出
router.post('/logout', function (req, res, next) {
  //根据ID重新生成token
  let new_token = Math.random().toString(36).substr(2)
  let admin_id = req.body.id
  DB.queryDB(
    'update `t_admin_list` set admin_token = ?  where admin_id = ?',
    [new_token, admin_id],
    function (error, result, fields) {
      if (error) {
        new Result(error, '更新token失败').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

module.exports = router

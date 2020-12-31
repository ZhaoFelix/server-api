var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var md5 = require('md5')

var queryString = require('querystring')
// 登录
router.post('/login', function (req, res, next) {
  let admin_name = req.body.username
  let passwd = md5(req.body.password.toUpperCase())
  // let passwd = req.body.password
  DB.queryDB(
    'select admin_token from `t_admin_list` where admin_login_name = ? and  admin_is_deleted = 0 limit 0,1',
    [admin_name],
    function (error, result, fields) {
      if (error) {
        let responseJson = {
          code: 20002,
          message: error,
          data: '查询用户名失败'
        }
        res.send(responseJson)
      } else {
        if (result.length == 0) {
          let responseJson = {
            code: 20002,
            message: '该用户不存在',
            data: admin_name
          }
          res.send(responseJson)
        } else {
          DB.queryDB(
            'select admin_token from `t_admin_list` where admin_login_name = ? and admin_pwd = ?  and admin_is_deleted = 0 limit 0,1',
            [admin_name, passwd],
            function (error, result, fields) {
              if (error) {
                let responseJson = {
                  code: 20002,
                  message: error,
                  data: '查询密码失败'
                }
                res.send(responseJson)
              } else {
                if (result.length == 0) {
                  let responseJson = {
                    code: 20002,
                    message: '密码不正确',
                    data: '密码不正确'
                  }
                  res.send(responseJson)
                } else {
                  let responseJson = {
                    code: 20000,
                    message: 'success',
                    data: result
                  }
                  res.send(responseJson)
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
        let responseJson = {
          code: 20002,
          message: 'error',
          data: 'token不存在'
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
        let responseJson = {
          code: 20002,
          message: 'error',
          data: '更新token失败'
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

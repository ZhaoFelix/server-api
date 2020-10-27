/*
    管理员用户相关的操作
*/

var express = require('express')
var router = express.Router()
var DB = require('../config/db')
var stringRandom = require('string-random')
var url = require('url')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

// 查看所有的管理员
router.get('/query/all', function (req, res, next) {
  DB.queryDB(
    'select * from `t_admin_list` where admin_is_deleted = 0',
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

//  新增管理员
router.post('/update/add', function (req, res, next) {
  // TODO:增加角色类型字段
  let admin_token = stringRandom(16) //生成包含数字和字母的16为字符串
  let admin_login_name = req.body.admin_login_name
  let admin_name = req.body.admin_name
  let admin_pwd = req.body.admin_pwd
  DB.queryDB(
    'INSERT INTO `t_admin_list` (`admin_login_name`,`admin_name`,`admin_pwd`,`admin_token`,`admin_created_time`) VALUES (?,?,?,?,NOW())',
    [admin_login_name, admin_name, admin_pwd, admin_token],
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

// 删除管理员
router.post('/update/delete', function (req, res, next) {
  let id = req.body.id
  DB.queryDB(
    'UPDATE `t_admin_list` SET admin_is_deleted = 0  WHERE admin_id = ?',
    [id],
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

//  编辑管理员信息
router.post('/update/edit', function (req, res, next) {
  let id = req.body.id
  let admin_passwd = req.body.pwd
  let admin_token = stringRandom(16) //生成包含数字和字母的16为字符串
  //更新密码和ID
  DB.queryDB(
    'UPDATE `t_admin_list` SET admin_passwd = ? , admin_token = ?  WHERE admin_id = ?',
    [admin_passwd, admin_token, id],
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

// 新增角色

// 查询所有角色
router.get('/type/query/all', function (req, res, next) {
  DB.queryDB(
    'select * from `t_admin_type` where admin_type_is_deleted = 0 order by admin_type_created_time',
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

router.post('/type/update/add', function (req, res, next) {
  let type_name = req.body.type_name
  DB.queryDB(
    'insert into t_admin_type (admin_type_name, admin_type_created_time)  values (?,NOW())',
    type_name,
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

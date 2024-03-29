/*
    管理员用户相关的操作
*/
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var stringRandom = require('string-random')
var url = require('url')
const Result = require('../../../utils/result')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

// 查看所有的管理员
router.get('/query/all', function (req, res, next) {
  DB.queryDB(
    'select * from `t_admin_list` where admin_is_deleted = 0  order by admin_last_time desc',
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 查询所有的第三方车队
router.get('/query/third', function (req, res, next) {
  DB.queryDB(
    'select  * from t_third_car where  third_is_deleted = 0 order by  third_created_time desc',
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

//  新增管理员
router.post('/update/add', function (req, res, next) {
  let admin_token = stringRandom(16) //生成包含数字和字母的16为字符串
  let { admin_login_name, admin_name, admin_pwd, admin_type, admin_third_id } =
    req.body
  DB.queryDB(
    'INSERT INTO `t_admin_list` (`admin_login_name`,`admin_name`,`admin_pwd`,`admin_token`,`admin_type`,`admin_created_time`,`admin_third_id`) VALUES (?,?,?,?,?,NOW(),?)',
    [
      admin_login_name,
      admin_name,
      admin_pwd,
      admin_token,
      admin_type,
      admin_third_id
    ],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 删除管理员
router.post('/update/delete', function (req, res, next) {
  let id = req.body.id
  console.log('删除管理员id为:' + id)
  DB.queryDB(
    'UPDATE `t_admin_list` SET admin_is_deleted = 1  WHERE admin_id = ? and admin_type != 1',
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

//  编辑管理员信息
router.post('/update/edit', function (req, res, next) {
  let { id, admin_passwd } = req.body
  let admin_token = stringRandom(16) //生成包含数字和字母的16为字符串
  //更新密码和ID
  DB.queryDB(
    'UPDATE `t_admin_list` SET admin_passwd = ? , admin_token = ?  WHERE admin_id = ?',
    [admin_passwd, admin_token, id],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
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
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

router.post('/type/update/add', function (req, res, next) {
  let { type_name, type } = req.body
  DB.queryDB(
    'insert into t_admin_type (admin_type_name,admin_type, admin_type_created_time)  values (?,?,NOW())',
    [type_name, type],
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 删除管理员角色类型
router.post('/type/update/delete', function (req, res, next) {
  var id = req.body.id

  DB.queryDB(
    'UPDATE `t_admin_type` SET admin_type_is_deleted = 1  WHERE admin_type_id = ?',
    id,
    function (error, result, fields) {
      if (error) {
        new Result(error, 'error').fail(res)
      } else {
        new Result(result, 'success').success(res)
      }
    }
  )
})

// 管理员角色升级

module.exports = router

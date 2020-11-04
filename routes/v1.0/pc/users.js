var express = require('express');
var router = express.Router();
var DB = require('../../../config/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 查询用户信息
router.get('/query/all', function(req, res, next) {
  DB.queryDB(
    'SELECT a.user_id, a.wechat_open_id, wechat_nickname, wechat_phone, b.info_adress FROM t_user_list a, t_user_info_list b WHERE a.wechat_open_id == b.wechat_id',
    function(error, result, fields) {
      if(error) {
        let respondJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(respondJson)
      } else {
        let respondJson = {
          code: 20000,
          message: 'success',
          data: result
        }
        res.send(respondJson)
      }
    }
  )
});

// 删除用户
router.post('/update/delete', function(req, res, next) {
  let id = req.body.user_id
  DB.queryDB(
    'UPDATE `t_user_list` LEFT JOIN `t_user_info_list` ON t_user_list.wechat_id = t_user_info_list.wechat_open_id SET wechat_is_deleted = 1, info_is_deleted = 1 WHERE user_id = ?',
    [id], function(error, result, fields) {
      if(error) {
        let respondJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(respondJson)
      } else {
        let respondJson = {
          code: 20000,
          message: 'success',
          data: result
        }
        res.send(respondJson)
      }
    }
  )
});

//编辑用户信息
router.post('/update/edit', function(req, res, next) {
  let {user_id, info_adress} = req.body
  DB.queryDB(
    'UPDATE `t_user_info_list` SET info_adress = ? where wechat_id = (SELECT wechat_open_id from `t_user_list` WHERE user_id = ?)', [info_adress, user_id],
    function(error, result, fields) {
      if(error) {
        let respondJson = {
          code: 20002,
          message: 'error',
          data: error
        }
        res.send(respondJson)
      } else {
        let respondJson = {
          code: 20000,
          message: 'success',
          data: result
        }
        res.send(respondJson)
      }
    }
  )
});

module.exports = router;

var express = require('express')
var DB = require('../../../config/db')
var request = require('request')
var config = require('../../../config/env')
config = config.mch
var router = express.Router()
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

//微信授权
router.post('/wxauth', function (req, res, next) {
  console.log(req.body)
  let code = req.body.code
  // 组合url
  let options = {
    method: 'POST',
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    formData: {
      appid: config.appId,
      secret: config.secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  }
  console.log(options);
  request(options, (error, response, body) => {
    if (error) {
      let responseJson = {
        code: 20002,
        message: 'error',
        data: error
      }
      res.send(responseJson)
    } else {
      console.log("body为-------")
      console.log(body)
      let data = JSON.parse(body)
      let session = data.session_key
      let openId = data.openid
      let responseJson = {
        code: 20000,
        message: 'openid获取成功',
        data: {
          session: session,
          openid: openId
        }
      }
      console.log("responseJson为-----------")
      console.log(responseJson)
      res.send(responseJson)
    }
  })
})
//微信登录
router.post('/wechat', function (req, res, next) {
  let { openId, avatarUrl, gender, nickName, province, country, user_type } = req.body
  console.log(openId, avatarUrl)
  return new Promise((resolve, reject) => {
    //是否已登录过，更新登录时间
    DB.queryDB(
      'SELECT COUNT(user_id) AS count FROM `t_user_list` WHERE wechat_open_id=?',
      openId,
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
      if (data[0].count >= 1) {
        //已登录，更新登录时间
        return new Promise((resolve, reject) => {
          DB.queryDB(
            'UPDATE `t_user_list` SET wechat_last_time= NOW() WHERE wechat_open_id = ?',
            openId,
            function (error, result, fields) {
              if (error) {
                reject(error)
              } else {
                resolve(result)
              }
            }
          )
        })
      } else {
        //未登录，添加记录
        return new Promise((resolve, reject) => {
          DB.queryDB(
            'INSERT INTO `t_user_list` (wechat_open_id,wechat_avatar,wechat_nickname,wechat_gender,wechat_region,wechat_created_time, user_type) VALUES(?,?,?,?,?,NOW(),?)',
            [openId, avatarUrl, nickName, gender, country, user_type],
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
      return new Promise((resolve, reject) => {
        DB.queryDB(
          'SELECT user_id, user_type FROM t_user_list WHERE wechat_open_id=? LIMIT 0,1',
          openId,
          function (error, result, fields) {
            if (error) {
              reject(error)
            } else {
              console.log(result)
              resolve(result)
            }
          }
        )
      })
    })
    .then((data) => {
      let responseJson = {
        code: 20000,
        message: '微信登录授权成功',
        data: data
      }
      res.send(responseJson)
    })
    .catch((error) => {
      let responseJson = {
        code: 20002,
        message: 'error',
        data: error
      }
      res.send(responseJson)
    })
})

module.exports = router

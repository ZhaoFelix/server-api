var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')
var md5 = require('md5')

var queryString = require('querystring')

// 查询所有物业经理人的信息
router.get("/query/all",function(req,res,next){
    DB.queryDB("select  * from t_estate_list", function (error, result, fields) {
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
      })
})
module.exports = router
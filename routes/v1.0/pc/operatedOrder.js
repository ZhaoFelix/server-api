/**
 * 订单处理
 * **/

var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var url = require('url')

// TODO:根据线路类型查询今日值班的司机
router.get('/driver/query',function(req,res,next){
    let date = new Date()
    let current_month = date.getMonth() + 1
    let current_date = date.getDate()

})

// TODO:根据司机的类型查询车辆信息
router.get('/car/query/',function(req,res,next){
    // 如果是替班司机
    // 非替班司机
})

module.exports = router
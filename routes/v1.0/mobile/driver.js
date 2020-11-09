const { request } = require("express");

var express = require('express')
var DB = require('../../../config/db');
const { route } = require("./user");
var router = express.Router()

// 测试
router.get('/', function(req, res, next) {
    res.send("mobile driver router respond with a resource")
});

// 获取司机id
router.get('/search', function(req, res, next) {
    DB.queryDB(
        'select * from `t_driver_list` where driver_name = ? and driver_is_deleted = 0', [driver_name],
        function(error, result, fields) {
            if(error) {
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

// 显示所有订单--不完善
router.get('/order/query/all', function(req, res, next) {
    DB.queryDB(
        'select * from `t_order_list` where order_is_deleted = 0', [],
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: '查询全部订单失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                let responseJson = {
                    code: 20000,
                    message: '查询成功',
                    data: result
                }
                res.send(responseJson)
            }
        }
    )
});

// 司机接单
router.get('/order/get', function(req, res, next) {
    let order_id = req.body.order_id
    DB.queryDB(
        'update `t_order_list` set driver_id = ? where order_id = ? and order_is_deleted = 0',[driver_id, order_id],
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: '接单失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                let responseJson = {
                    code: 20000,
                    message: '接单成功',
                    data: result
                }
                res.send(responseJson)
            }
        }
    )
});
module.exports = router
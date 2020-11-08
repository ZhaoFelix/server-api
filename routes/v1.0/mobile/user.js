var express = require("express");
var DB = require("../../../config/db")

var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('mobile user router respond with a resource')
})

// 添加用户详细信息
router.post('/info/update/add', function(req, res, next) {
    let {wechat_id, user_name} = req.body
    let adress = req.body.adress+" "+req.body.detail_adress
    DB.queryDB(
        'insert into `t_user_info_list` (wechat_id, user_name, info_adress, created_time) values (?, ?, ?, NOW())',[wechat_id, user_name, adress],
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: '插入失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                let responseJson = {
                    code: 20000,
                    message: '插入成功',
                    data: result
                }
                res.send(responseJson)
            }
        }
    )
});

// 用户查询自己的订单
router.get('/order/query/all', function(req, res, next) {
    let id = req.body.user_id
    DB.queryDB(
        'select * from `t_order_list` where user_id = ?', id,
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
});

// 用户下单
router.post('/order/update/add', function(req, res, next) {
    let {wechat_id, user_name, phone, area, time, remark, flag, image, price} = req.body
    let adress = req.body.adress + " " + req.body.detail_adress
    DB.queryDB(
        'select user_id from `t_user_list` where wechat_open_id = (select wechat_id from `t_user_info_list` where user_name = ?)', user_name,
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: 'error',
                    data: error
                }
                res.send(error)
            } else {
                id = result.user_id
                DB.queryDB(
                    'insert into `t_order_list` (user_id, order_price, order_created_time) values (? ,? , NOW())', [id, price],
                    function(error, result, fields) {
                        if(error) {
                            let responseJson = {
                                code: 20002,
                                message: '下单失败，插入订单列表失败',
                                data: error
                            }
                            res.send(responseJson)
                        } else {
                            DB.queryDB(
                                'insert into `t_order_img` (order_id, user_place_order_img) values (?, ?)',[result.insertId ,image],
                                function(error, result, fields) {
                                    if(error) {
                                        let responseJson = {
                                            code: 20002,
                                            message: '下单失败-插入订单图片失败',
                                            data: error
                                        }
                                        res.send(responseJson)
                                    } else {
                                        DB.queryDB(
                                            'insert into `t_order_time` (order_id, place_order_time, created_time) values (?, NOW(), NOW())',[result.insertId],
                                            function(error, result, fields) {
                                                if(error) {
                                                    let responseJson = {
                                                        code: 20002,
                                                        message: '下单失败-插入下单时间失败',
                                                        data: error
                                                    }
                                                    res.send(responseJson)
                                                } else {
                                                    let responseJson = {
                                                        code: 20000,
                                                        message: '下单成功',
                                                        data: result
                                                    }
                                                    res.send(responseJson)
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    }
                )
            }
        }
    )
})
module.exports = router

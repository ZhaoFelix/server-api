var express = require("express");
var DB = require("../../../config/db")

var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('mobile user router respond with a resource')
})

// 查询uers_id
router.get('/search', function(req, res, next) {
    let wechat_id = req.body.wechat_id
    DB.queryDB(
        'select user_id from `t_user_list` where wechat_open_id = ? and wechat_is_deleted = 0', [wechat_id],
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
        'select * from `t_order_list` where user_id = ? and order_is_deleted = 0 order by order_created_time', id,
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
    let insertId;
    let {user_name, phone, area, time, remark, flag, image, price} = req.body
    let adress = req.body.adress + " " + req.body.detail_adress
    DB.queryDB(
        'select * from `t_user_list` where wechat_open_id = (select wechat_id from `t_user_info_list` where user_name = ?)', user_name,
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: 'error',
                    data: error
                }
                res.send(error)
            } else {
                // console.log(result)
                var dataString = JSON.stringify(result);
                var data = JSON.parse(dataString);
                // console.log(data[0])
                id = data[0].user_id
                // console.log(data[0].user_id)
                DB.queryDB(
                    'insert into `t_order_list` (user_id, order_price, order_created_time, order_reserve_time) values (? ,? , NOW(), ?)', [id, price, time],
                    function(error, result, fields) {
                        if(error) {
                            let responseJson = {
                                code: 20002,
                                message: '下单失败，插入订单列表失败',
                                data: error
                            }
                            res.send(responseJson)
                        } else {
                            insertId = result.insertId
                            //console.log(insertId)
                            DB.queryDB(
                                'insert into `t_order_img` (order_id, user_place_order_img, order_img_created_time) values (?, ?, NOW())',[insertId ,image],
                                function(error, result, fields) {
                                    if(error) {
                                        let responseJson = {
                                            code: 20002,
                                            message: '下单失败-插入订单图片失败',
                                            data: error
                                        }
                                        res.send(responseJson)
                                    } else {
                                        //console.log(insertId)
                                        DB.queryDB(
                                            'insert into `t_order_time` (order_id, place_order_time, created_time) values (?, NOW(), NOW())',[insertId],
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
});

router.post('/order/update/add/2', function(req, res, next) {
    let time = req.body.time
    let user_id = req.body.user_id
    DB.queryDB(
        'select * from `t_order_list` where user_id = ? and order_is_deleted = 0', [user_id],
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: '该用户之前没有创建订单',
                    data: error
                }
                res.send(responseJson)
            } else {
                var dataString = JSON.stringify(result);
                var data = JSON.parse(dataString);
                let {order_price} = data[0]
                DB.queryDB(
                    'insert into `t_order_list` (order_price, user_reserve_time) values (?, ?)', [order_price, time],
                    function(error, result, fields) {
                        
                    }
                )
            }
        }
    )
});
module.exports = router

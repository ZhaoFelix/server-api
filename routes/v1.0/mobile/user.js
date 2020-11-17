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
                console.log(result)
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

// 插入微信信息
router.post('/info/add', function(req, res, next) {
    let {wechat_id, wechat_nickname, wechat_avatar, wechat_age, wechat_region, wechat_phone, wechat_last_time} = req.body
    DB.queryDB(
        'select * from `t_user_list` where wechat_open_id = ? and wechat_is_deleted = 0', [wechat_id],
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: '查询失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                if(result.length == 0) {
                    DB.queryDB(
                        'insert into `t_user_list` (wechat_open_id, wechat_nickname, wechat_avatar, wechat_age, wechat_region, wechat_phone, wechat_created_time, wechat_last_time) values (?, ?, ?, ?, ?, ?, NOW(), NOW())',
                        [wechat_id, wechat_nickname, wechat_avatar, wechat_age, wechat_region, wechat_phone],
                        function(error, result, fields) {
                            if(error) {
                                let responseJson = {
                                    code: 20002,
                                    message: '插入新用户信息失败',
                                    data: error
                                }
                                res.send(responseJson)
                            } else {
                                let responseJson = {
                                    code: 20000,
                                    message: '插入新用户信息成功',
                                    data: result
                                }
                                res.send(responseJson)
                            }
                        }
                    )
                } else {
                    DB.queryDB(
                        'update `t_user_list` set wechat_nickname = ?, wechat_avatar = ?, wechat_age = ?, wechat_region = ?, wechat_phone = ? ,wechat_last_time = NOW() where wechat_open_id = ? and wechat_is_deleted  = 0',
                        [wechat_nickname, wechat_avatar, wechat_age, wechat_region, wechat_phone, wechat_id],
                        function(error, result, fields) {
                            if(error) {
                                let responseJson = {
                                    code: 20002,
                                    message: '更新信息失败',
                                    data: error
                                }
                                res.send(responseJson)
                            } else {
                                let responseJson = {
                                    code: 20000,
                                    message: '更新信息成功',
                                    data: result
                                }
                                res.send(responseJson)
                            }
                        }
                    )
                }
            }
        }
    )
});

// 判断身份
router.get('/search/identity', function(req, res, next) {
    let identity = req.body.identity
    let {wechat_id} = req.body
    if(identity == 'user') {
        DB.queryDB(
            'select * from `t_user_list` where wechat_open_id = ? and wechat_is_deleted = 0', [wechat_id],
            function(error, result, fields) {
                if(error) {
                    let responseJson = {
                        code: 20002,
                        message: '查询身份失败',
                        data: error
                    } 
                    res.send(responseJson)
                } else {
                    // console.log("user")
                    // console.log(result)
                    if(result.length == 0) {
                        let responseJson = {
                            code: 20000,
                            message: '该用户不存在',
                            data: result
                        }
                        res.send(responseJson)
                    } else {
                        let responseJson = {
                            code: 20000,
                            message: '核对身份成功',
                            data: result
                        }
                        res.send(responseJson)
                    }
                }
            }
        )
    } else if(identity == 'estate'){
        DB.queryDB(
            'select * from `t_estate_info` where estate_wechat_id = ?', [wechat_id],
            function(error, result, fields) {
                if(error) {
                    let responseJson = {
                        code: 20002,
                        message: '查询身份失败',
                        data: error
                    } 
                    res.send(responseJson)
                } else {
                    console.log("estate")
                    if(result.length == 0) {
                        let responseJson = {
                            code: 20000,
                            message: '该物业不存在',
                            data: result
                        }
                        res.send(responseJson)
                    } else {
                        let responseJson = {
                            code: 20000,
                            message: '核对身份成功',
                            data: result
                        }
                        res.send(responseJson)
                        // TODO:更新t_estate_list表中的用户ID，物业认证状态，认证时间。
                    }
                }
            }
        )
    } else {
        let responseJson = {
            message: '此类角色不存在'
        }
        res.send(responseJson)
    }
});

// 添加用户详细信息
router.post('/info/update/add', function(req, res, next) {
    let {id, user_name} = req.body
    let adress = req.body.adress+" "+req.body.detail_adress
    DB.queryDB(
        'insert into `t_user_info_list` (user_id, user_name, info_adress, created_time) values (?, ?, ?, NOW())',[id, user_name, adress],
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
        'select * from `t_order_list` where user_id = ? and order_is_deleted = 0 order by order_created_time', [id],
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
    let {user_id, user_name, phone, area, time, remark, flag, image, price} = req.body
    let adress = req.body.adress + " " + req.body.detail_adress
    DB.queryDB(
        'select * from `t_user_list` where user_id = ? and wechat_is_deleted = 0 order by wechat_last_time limit 1', user_id,
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: 'error',
                    data: error
                }
                res.send(responseJson)
            } else {
                // console.log(result)
                var dataString = JSON.stringify(result);
                var data = JSON.parse(dataString);
                // console.log(data[0])
                id = data[0].user_id
                // console.log(data[0].user_id)
                DB.queryDB(
                    'insert into `t_order_list` (user_id, order_price, order_created_time, user_reserve_time) values (? ,? , NOW(), ?)', [id, price, time],
                    function(error, result, fields) {
                        if(error) {
                            let responseJson = {
                                code: 20002,
                                message: '插入订单失败',
                                data: error
                            }
                            res.send(responseJson)
                        } else {
                            insertId = result.insertId
                            DB.queryDB(
                                'insert into `t_order_info_list` (id, user_place_order_img, user_place_order_time, created_time) values (?, ?, NOW(), NOW())',
                                [insertId, image],
                                function(error, result, fields) {
                                    if(error) {
                                        let responseJson = {
                                            code: 20002,
                                            message: '插入订单信息失败',
                                            data: error
                                        }
                                        res.send(responseJson)
                                    } else {
                                        let responseJson = {
                                            code: 20000,
                                            message: '插入订单信息成功',
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
});

// 两次下单
router.post('/order/update/add/2', function(req, res, next) {
    let user_id = req.body.user_id
    DB.queryDB(
        'select * from `t_order_list` where user_id = ? and order_is_deleted = 0 order by order_created_time desc limit 1', [user_id],
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: '查询失败',
                    data: error
                }
                res.send(responseJson)
            } else {
                var dataString = JSON.stringify(result);
                var data = JSON.parse(dataString);
                let {order_id} = data[0]
                DB.queryDB(
                    'insert into `t_order_list`(order_id, driver_id, user_id, order_price, order_final_price, order_status, order_pay_time, order_created_time, user_reserve_time) select @order_id = order_id + 1, driver_id, user_id, order_price, order_final_price, order_status, order_pay_time, NOW(), user_reserve_time from t_order_list WHERE order_id = ?', [order_id],
                    function(error, result, fields) {
                        if(error) {
                            let responseJson = {
                                code: 20002,
                                message: '下单失败',
                                data: error
                            }
                            res.send(responseJson)
                        } else {
                            DB.queryDB(
                                'insert into `t_order_info_list`(id, user_place_order_img, user_place_order_time, driver_reach_img, driver_reach_time, driver_get_img, driver_get_time, driver_complete_img, driver_complete_time, created_time) select @id= id + 1, user_place_order_img, user_place_order_time, driver_reach_img, driver_reach_time, driver_get_img, driver_get_time, driver_complete_img, driver_complete_time, NOW() from `t_order_info_list` where id = ?', [order_id],
                                function(error, result, fields) {
                                    if(error) {
                                        let responseJson = {
                                            code: 20002,
                                            message: '插入订单详细信息失败',
                                            data: error 
                                        }
                                        res.send(responseJson)
                                    } else {
                                        let responseJson = {
                                            code: 20000,
                                            message: '插入订单成功',
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
});

module.exports = router

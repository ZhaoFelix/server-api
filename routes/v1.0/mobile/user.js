var express = require("express");
var DB = require("../../../config/db")

var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('mobile user router respond with a resource')
})

// 用户下订单
router.post('/order/update/add', function(req, res, next) {
    let {nickname, phone, car_type, car_price} = req.body
    let adress = req.body.adress+" "+req.body.detail_adress
    DB.queryDB(
        'select * from `t_car_type` where type_name = ? and tyep_is_deleted = 0', [car_type],
        function(error, result, fields) {
            if(error) {
                let responseJson = {
                    code: 20002,
                    message: '该车型不存在',
                    data: error
                }
                res.send(responseJson)
            } else {
                DB.queryDB(
                    'insert into `t_user_info_list` (wechat_if, info_adress, created_time) values (select wechat_open_id from `t_user_list` where wechat_nickname = ?, ?, NOW())',[nickname, adress],
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
            }
        }
    )
});

// 用户查询自己的订单
router.get('/order/query/all', function(req, res, next) {
    let id = req.body.wechat_open_id
    DB.queryDB(
        
    )

})
module.exports = router

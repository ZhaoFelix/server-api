var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var wxpay = require('../../../utils/wxpay') 
var xmlparse = require('express-xml-bodyparser')
var config = require('../../../config/env')
const mch = config.mch
// 微信支付
router.post('/wxpay',function(req,res,next){
    let {openId,userId,userName,userPhone,userIsFirst,userNote,userImage,userAddress,userReserveTime,orderUserType,orderSize} = req.body;
    let appId = mch.appId
    let nofity_url = mch.notify_url
    let ip = mch.ip
    let attach = mch.attach
    let body = mch.body
    // TODO:价格待添加计算方式
    let money = 1000
    wxpay.order(appId,attach,openId,money,notify_url,ip)
    .then((result) => {
        DB.queryDB(```INSERT INTO t_order_list (user_id,order_price,user_reserve_time,order_size,order_user_type,order_number,
            user_phone,user_address,user_is_first,user_note,order_created_time)
             VALUES (?,?,?,?,?,?,?,?,?,?,NOW())```,
             [userId,money,userReserveTime,orderSize,orderUserType,result.tradeNo,userPhone,userAddress,userIsFirst,userNote],function(error,result,fields){
            if (error) {
                let responseJson = {
                    code: 20002,
                    message: '创建订单失败',
                    data: error
                  }
                  res.send(responseJson)
            } else {
                let responseJson = {
                    code: 20000,
                    message: '支付配置成功',
                    data: result
                  }
                  res.send(responseJson)

                //  TODO:订单创建成功后将用户提交的图片链接存储到t_order_info_list表
            }
        })
    })
    .catch((error) => {
        let responseJson = {
            code: 20002,
            message: '创建订单失败',
            data: error
          }
          res.send(responseJson)
    })

})

module.exports = router
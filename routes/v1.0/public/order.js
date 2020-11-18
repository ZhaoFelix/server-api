var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var wxpay = require('../../../utils/wxpay') 
var xmlparser = require('express-xml-bodyparser')
var config = require('../../../config/env')
const { order } = require('../../../utils/wxpay')
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
        DB.queryDB('INSERT INTO t_order_list (user_id,order_price,user_reserve_time,order_size,order_user_type,order_number, user_phone,user_address,user_is_first,user_note,order_created_time) VALUES (?,?,?,?,?,?,?,?,?,?,NOW())',
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

// TODO:微信支付回调，更新订单的状态、更新最终金额、更新订单的支付时间
router.post(
    '/callback',
    xmlparser({ trim: false, explicitArray: false }),
    function (req, res) {
      var jsonData = req.body.xml
      if (jsonData.result_code == 'SUCCESS') {
        //支付成功，更新订单状态
        let tradeNo = jsonData.out_trade_no
        let order_final_price = jsonData.price
        DB.queryDB(
          'UPDATE `t_order_list` SET order_status=1,order_pay_time=NOW(),order_final_price = ? WHERE order_number = ? AND order_status=0',
          [tradeNo,order_final_price],
          function (error, result, fields) {
            if (!error) {
              console.log(tradeNo + '订单更新成功')
            } else {
              console.log(tradeNo + '订单更新失败,错误原因：' + error)
            }
          }
        )
      } else {
        //失败
        console.log(
          '当前订单的支付状态，result_code:' +
            jsonData.result_code +
            'return_code:' +
            jsonData.return_code
        )
      }
    }
  )
module.exports = router
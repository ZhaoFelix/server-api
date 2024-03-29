/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-11-17 08:57:51
 * @LastEditTime: 2021-05-20 12:58:36
 * @FilePath: /server-api/routes/v1.0/public/order.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
var express = require('express')
var router = express.Router()
var DB = require('../../../config/db')
var wxpay = require('../../../utils/wxpay')
var xmlparser = require('express-xml-bodyparser')
var config = require('../../../config/env')
let common = require('../../../utils/common')
let util = require('../../../utils/pay.js')

const mch = config.mch
// 普通微信支付
router.post('/usual/wxpay', function (req, res, next) {
  let {
    userId,
    userType,
    address,
    buildArea,
    imagesList,
    isFirst,
    isAssign,
    name,
    openId,
    orderNote,
    orderPrice,
    phoneNumber,
    selectTime,
    subAddress,
    orderType,
    estate_id,
    estate_plot
  } = req.body
  let appId = mch.appId
  let notify_url = mch.notify_url
  let ip = mch.ip
  let attach =
    '普通装修清运 ' + '地址：' + address + subAddress + '(' + estate_plot + ')'
  let body = attach
  console.log(attach)
  // TODO:价格待添加计算方式
  let money = config.isDebug
    ? 1
    : process.env.NODE_ENV == config.prd.env
    ? common.clocPrice(buildArea, isFirst, userType)
    : 1
  console.log('测试2')
  console.log('支付价格' + parseInt(money))
  let detail = [
    {
      goods_detail: [
        {
          goods_id: 'mp100',
          goods_name: '装修垃圾清运',
          quantity: 1,
          price: money,
          goods_category: '普通装修',
          body: '订单地址:' + address + subAddress
        }
      ]
    }
  ]
  wxpay
    .order(appId, attach, body, openId, parseInt(money), notify_url, ip, detail)
    .then((result) => {
      DB.queryDB(
        'INSERT INTO t_order_list (user_id,order_price,user_reserve_time,order_size,order_user_type,order_number, user_phone,user_address,user_is_first,order_is_assign,user_note,order_user_name,order_type,estate_id,order_created_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())',
        [
          userId,
          orderPrice,
          common.timeFormatter(selectTime),
          buildArea,
          userType,
          result.tradeNo,
          phoneNumber,
          address + subAddress,
          isFirst,
          isAssign,
          orderNote,
          name,
          orderType,
          estate_id
        ],
        function (error, re, fields) {
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
            let order_id = re.insertId
            //  订单创建成功后将用户提交的图片链接存储到t_order_info_list表
            DB.queryDB(
              'insert  into t_order_info_list (user_place_order_img,user_place_order_time,order_id,created_time) values (?,Now(),?,NOW())',
              [JSON.stringify(imagesList), order_id],
              function (error, resu, fields) {
                if (error) {
                  console.log('新建订单信息记录失败，error:' + error)
                } else {
                  console.log(
                    '新建订单信息记录成功，记录ID为：' + resu.insertId
                  )
                }
              }
            )
          }
        }
      )
    })
    .catch((error) => {
      let responseJson = {
        code: 20002,
        message: '支付配置失败',
        data: error
      }
      res.send(responseJson)
    })
})

// 按箱微信支付
router.post('/box/wxpay', function (req, res, next) {
  let {
    userId,
    userType,
    address,
    buildArea,
    imagesList,
    isFirst,
    isAssign,
    name,
    openId,
    orderNote,
    orderPrice,
    phoneNumber,
    selectTime,
    subAddress,
    orderType,
    estate_id,
    boxNumber,
    estate_plot
  } = req.body
  let appId = mch.appId
  let notify_url = mch.notify_url
  let ip = mch.ip
  let attach =
    '垃圾箱清运 地址：' + address + subAddress + '(' + estate_plot + ')'
  let body = attach
  console.log(attach)
  // TODO:价格
  let money = config.isDebug
    ? 1
    : process.env.NODE_ENV == config.prd.env
    ? Number(boxNumber) * config.boxPrice * 100 * 0.8
    : 1
  let detail = [
    {
      goods_detail: [
        {
          goods_id: 'mp101',
          goods_name: '装修垃圾清运',
          quantity: 1,
          price: money,
          goods_category: '普通装修',
          body: '订单地址：' + address + subAddress
        }
      ]
    }
  ]

  wxpay
    .order(appId, attach, body, openId, parseInt(money), notify_url, ip, detail)
    .then((result) => {
      DB.queryDB(
        'INSERT INTO t_order_list (user_id,order_price,user_reserve_time,order_size,order_user_type,order_number, user_phone,user_address,user_is_first,order_is_assign,user_note,order_user_name,order_type,estate_id,box_number,order_created_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())',
        [
          userId,
          Number(boxNumber) * config.boxPrice,
          common.timeFormatter(selectTime),
          buildArea,
          userType,
          result.tradeNo,
          phoneNumber,
          address + subAddress,
          isFirst,
          isAssign == undefined ? 0 : isAssign,
          orderNote,
          name,
          orderType,
          estate_id,
          Number(boxNumber)
        ],
        function (error, re, fields) {
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
            let order_id = re.insertId
            //  订单创建成功后将用户提交的图片链接存储到t_order_info_list表
            DB.queryDB(
              'insert  into t_order_info_list (user_place_order_img,user_place_order_time,order_id,created_time) values (?,Now(),?,NOW())',
              [JSON.stringify(imagesList), order_id],
              function (error, resu, fields) {
                if (error) {
                  // TODO:将订单更新信息写入文件
                  console.log('新建订单信息记录失败，error:' + error)
                } else {
                  console.log(
                    '新建订单信息记录成功，记录ID为：' + resu.insertId
                  )
                }
              }
            )
          }
        }
      )
    })
    .catch((error) => {
      let responseJson = {
        code: 20002,
        message: '支付配置失败',
        data: error
      }
      res.send(responseJson)
    })
})

// 商业支付
router.post('/business/wxpay', function (req, res, next) {
  let {
    userId,
    userType,
    address,
    buildArea,
    imagesList,
    isFirst,
    isAssign,
    name,
    openId,
    orderNote,
    orderPrice,
    phoneNumber,
    selectTime,
    subAddress,
    orderType,
    estate_id,
    boxNumber
  } = req.body
  let appId = mch.appId
  let notify_url = mch.notify_url
  let ip = mch.ip
  let attach = '商业装修清运 地址：' + address + subAddress
  let body = attach

  // TODO:价格
  let money = config.isDebug ? 1 : Number(orderPrice) * 100
  let detail = [
    {
      goods_detail: [
        {
          goods_id: 'mp101',
          goods_name: '装修垃圾清运',
          quantity: 1,
          price: money,
          goods_category: '普通装修',
          body: '订单地址：' + address + subAddress
        }
      ]
    }
  ]

  wxpay
    .order(appId, attach, body, openId, parseInt(money), notify_url, ip, detail)
    .then((result) => {
      DB.queryDB(
        'INSERT INTO t_order_list (user_id,order_price,user_reserve_time,order_size,order_user_type,order_number, user_phone,user_address,user_is_first,order_is_assign,user_note,order_user_name,order_type,estate_id,order_created_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,462,NOW())',
        [
          userId,
          orderPrice,
          common.timeFormatter(selectTime),
          buildArea,
          userType,
          result.tradeNo,
          phoneNumber,
          address + subAddress,
          isFirst,
          isAssign == undefined ? 0 : isAssign,
          orderNote,
          name,
          orderType
        ],
        function (error, re, fields) {
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
            let order_id = re.insertId
            //  订单创建成功后将用户提交的图片链接存储到t_order_info_list表
            DB.queryDB(
              'insert  into t_order_info_list (user_place_order_img,user_place_order_time,order_id,created_time) values (?,Now(),?,NOW())',
              [JSON.stringify(imagesList), order_id],
              function (error, resu, fields) {
                if (error) {
                  // TODO:将订单更新信息写入文件
                  console.log('新建订单信息记录失败，error:' + error)
                } else {
                  console.log(
                    '新建订单信息记录成功，记录ID为：' + resu.insertId
                  )
                }
              }
            )
          }
        }
      )
    })
    .catch((error) => {
      let responseJson = {
        code: 20002,
        message: '支付配置失败',
        data: error
      }
      res.send(responseJson)
    })
})

router.post('/wxpay2', function (req, res, next) {
  let {
    userId,
    openId,
    order_type,
    order_price,
    order_number,
    payType,
    order_gap_price,
    user_address,
    estate_plot
  } = req.body
  let appId = mch.appId
  let notify_url = mch.notify_url2
  let ip = mch.ip
  let attach =
    (order_type == 1 ? '普通装修清运 地址：' : '垃圾箱清运 地址：') +
    user_address +
    '(' +
    estate_plot +
    ')'
  console.log(attach)
  let body = attach
  // 补差价order_gap_price * 100
  if (payType == 1) {
    wxpay
      .order(appId, attach, body, openId, order_gap_price, notify_url, ip)
      .then((result) => {
        DB.queryDB(
          'update  t_order_list set new_order_number = ?,order_status = 1 where  order_number = ? and order_status = 0',
          [result.tradeNo, order_number],
          function (error, resu, fields) {
            if (error) {
              let responseJson = {
                code: 20002,
                message: '新订单号更新失败',
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
            }
          }
        )
      })
      .catch((error) => {
        let responseJson = {
          code: 20002,
          message: '支付配置失败',
          data: error
        }
        res.send(responseJson)
      })
  }
  // 商业装修支付
  else {
    let detail = [
      {
        goods_detail: [
          {
            goods_id: 'mp101',
            goods_name: '装修垃圾清运',
            quantity: 1,
            goods_category: '普通装修',
            body: '订单地址：' + user_address
          }
        ]
      }
    ]
    wxpay
      .order(
        appId,
        attach,
        body,
        openId,
        // TODO
        config.isDebug ? 1 : order_price * 100 * 0.8,
        mch.notify_url,
        ip,
        detail
      )
      .then((result) => {
        DB.queryDB(
          'update  t_order_list set new_order_number = ? where  order_number = ?',
          [result.tradeNo, order_number],
          function (error, resu, fields) {
            if (error) {
              let responseJson = {
                code: 20002,
                message: '新订单号更新失败',
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
            }
          }
        )
      })
      .catch((error) => {
        let responseJson = {
          code: 20002,
          message: '支付配置失败',
          data: error
        }
        res.send(responseJson)
      })
  }
})

// 微信支付回调，更新订单的状态、更新最终金额、更新订单的支付时间
router.post(
  '/callback',
  xmlparser({ trim: false, explicitArray: false }),
  function (req, res) {
    var jsonData = req.body.xml
    if (jsonData.result_code == 'SUCCESS') {
      //支付成功，更新订单状态
      let tradeNo = jsonData.out_trade_no
      let order_final_price = jsonData.total_fee
      DB.queryDB(
        'UPDATE t_order_list SET order_status=1,order_pay_time=NOW(),order_final_price = ? WHERE (order_number = ? or new_order_number = ? ) AND order_status=0',
        [order_final_price / 100, tradeNo, tradeNo],
        function (error, result, fields) {
          if (error) {
            console.log(tradeNo + '订单更新失败,错误原因：' + error)
          } else {
            res.writeHead(200, { 'Content-Type': 'text/xml' })
            const re = `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`
            res.end(re)
            console.log(tradeNo + '订单更新成功')
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

// 差价支付回调
router.post(
  '/secallback',
  xmlparser({ trim: false, explicitArray: false }),
  function (req, res) {
    var jsonData = req.body.xml
    if (jsonData.result_code == 'SUCCESS') {
      //支付成功，更新订单状态
      let tradeNo = jsonData.out_trade_no
      let order_final_price = jsonData.total_fee
      DB.queryDB(
        'UPDATE t_order_list SET order_status=4,second_pay_time=NOW(), second_pay_price=? WHERE new_order_number = ? AND order_status=7',
        [order_final_price / 100, tradeNo],
        function (error, result, fields) {
          if (error) {
            console.log(tradeNo + '订单更新失败,错误原因：' + error)
          } else {
            console.log(tradeNo + '订单更新成功')
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

// 商业下单，只创建订单配置支付信息
router.post('/business', function (req, res, next) {
  let {
    userId,
    userType,
    address,
    buildArea,
    imagesList,
    isFirst,
    name,
    orderNote,
    phoneNumber,
    selectTime,
    subAddress,
    orderType,
    estate_id
  } = req.body
  let tradeNo = util.getTradeId('mp')
  DB.queryDB(
    'INSERT INTO t_order_list (user_id,user_reserve_time,order_size,order_user_type,order_number, user_phone,user_address,user_is_first,user_note,order_user_name,order_type,estate_id,order_created_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NOW())',
    [
      userId,
      selectTime,
      buildArea,
      userType,
      tradeNo,
      phoneNumber,
      address + subAddress,
      isFirst,
      orderNote,
      name,
      orderType,
      estate_id
    ],
    function (error, re, fields) {
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
          message: '下单成功',
          data: re
        }
        res.send(responseJson)
        let order_id = re.insertId
        DB.queryDB(
          'insert  into t_order_info_list (user_place_order_img,user_place_order_time,order_id,created_time) values (?,Now(),?,NOW())',
          [JSON.stringify(imagesList), order_id],
          function (error, resu, fields) {
            if (error) {
              console.log('新建订单信息记录失败，error:' + error)
            } else {
              console.log('新建订单信息记录成功，记录ID为：' + resu.insertId)
            }
          }
        )
      }
    }
  )
})
module.exports = router

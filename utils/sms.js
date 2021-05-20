/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-05-19 08:18:36
 * @LastEditTime: 2021-05-20 14:12:11
 * @FilePath: /server-api/utils/sms.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

const express = require('express')
const router = express.Router()
const request = require('request')
var path = require('path')
const options = require('../config/env')
var DB = require('../config/db')
const { Console } = require('console')
// 获取公众号token
function getToken() {
  return new Promise((resolve, reject) => {
    //需要发送get请求
    const url =
      'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
      options.wechat.AppID +
      '&secret=' +
      options.wechat.AppSecret +
      ''
    let option = {
      url: url,
      method: 'GET',
      json: true,
      headers: {
        'content-type': 'application/json'
      }
    }
    request(option, function (error, response, body) {
      resolve(body)
    })
  })
}

// 对公众号发送模板消息
function sendMessage(access_token, orders) {
  return new Promise((resolve, reject) => {
    //需要发送POST请求
    const url =
      'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' +
      access_token
    console.log(orders)
    const order = orders[0]
    const data = {
      touser: 'oVcao5PmujLZMdS89Jwqlh9UpXPo', //order.wechat_open_id,
      template_id: options.wechat.templateId,
      data: {
        first: {
          value: '您有新的订单，请及时上门清运',
          color: '#173177'
        },
        keyword1: {
          value: order.estate_name,
          color: '#173177'
        },
        keyword2: {
          value: order.user_phone,
          color: '#173177'
        },
        keyword3: {
          value: order.user_address + '(' + order.estate_plot + ')',
          color: '#173177'
        },
        keyword4: {
          value: order.reserve_time,
          color: '#173177'
        },
        remark: {
          value:
            '备注 ' +
            (order.order_type == 1
              ? '普通装修'
              : order.order_type == 2
              ? '垃圾箱清运'
              : ' 商业装修'),
          color: '#173177'
        }
      }
    }
    let option = {
      url: url,
      method: 'POST',
      json: true,
      body: data,
      headers: {
        'content-type': 'application/json'
      }
    }
    console.log(data)
    request(option, function (error, response, body) {
      console.log('响应')
      console.log(response)
      resolve(body)
    })
  })
}

// 查询订单和司机信息
function queryDriverAndOrder(order_id, dirver_id) {
  console.log(order_id, dirver_id)
  DB.queryDB(
    `select  A.user_address,A.user_phone,if(substring_index(user_reserve_time, ' ',-1) = '08:00:00', concat(substring_index(user_reserve_time, ' ',1), ' 上午' ),concat(substring_index(user_reserve_time, ' ',1), ' 下午' ) ) as reserve_time ,A.order_type,B.estate_name,B.estate_phone,B.estate_plot,C.wechat_open_id from t_order_list A, t_estate_list B, t_user_list C where A.order_id = ? and C.user_id = (select  wechat_id from t_driver_list where driver_id = ? ) and A.driver_id = ? and B.estate_id = A.estate_id
  `,
    [order_id, dirver_id, dirver_id],
    async function (error, result, next) {
      if (error) {
        //
        console.log('查询信息失败，error：' + error)
      } else {
        let { access_token } = await getToken()
        console.log(access_token)
        sendMessage(access_token, result)
      }
    }
  )
}

module.exports = {
  queryDriverAndOrder
}

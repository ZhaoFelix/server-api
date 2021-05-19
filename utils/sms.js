/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-05-19 08:18:36
 * @LastEditTime: 2021-05-19 08:43:39
 * @FilePath: /server-api/utils/sms.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

const express = require('express')
const router = express.Router()
const request = require('request')
var path = request('path')
const options = require('../config/env')

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
function sendMessage(access_token, openid, orders) {
  return new Promise((resolve, reject) => {
    //需要发送POST请求
    const url =
      'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' +
      access_token
    const order = orders[0]
    const data = {
      touser: openid,
      template_id: options.wechat.templateId,
      data: {
        first: {
          value: '派单通知',
          color: '#173177'
        },
        keyword1: {
          value: order.order_number,
          color: '#173177'
        },
        keyword2: {
          value: order.order_name,
          color: '#173177'
        },
        keyword3: {
          value: order.order_phone,
          color: '#173177'
        },
        keyword4: {
          value: order.consignee_addr,
          color: '#173177'
        },
        keyword5: {
          value: order.order_price + '元',
          color: '#173177'
        },
        remark: {
          value: al,
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
    request(option, function (error, response, body) {
      resolve(body)
    })
  })
}

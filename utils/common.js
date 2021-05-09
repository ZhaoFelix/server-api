/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-07 09:40:25
 * @LastEditTime: 2021-05-09 14:16:55
 * @FilePath: /server-api/utils/common.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
let { estate, jwt_options } = require('../config/env')
let crypto = require('crypto')
const jwt = require('jsonwebtoken')

function clocPrice(buildArea, isFirst, userType) {
  let finalPrice = 0
  // // 是否是首次装修
  // if (isFirst == '1') {
  //   if (Number(buildArea) >= 55 && Number(buildArea) <= 140) {
  //     finalPrice = 300 + (Number(buildArea) - 55) * 5
  //   } else if (Number(buildArea) > 140) {
  //     finalPrice = 300 + (140 - 55) * 5 + (Number(buildArea) - 140) * 7
  //   } else {
  //     finalPrice = 300
  //   }
  // } else {
  if (Number(buildArea) >= 55 && Number(buildArea) <= 140) {
    finalPrice = 360 + (Number(buildArea) - 55) * 6
  } else if (Number(buildArea) > 140) {
    finalPrice = 360 + (140 - 55) * 6 + (Number(buildArea) - 140) * 8
  } else {
    finalPrice = 360
  }
  // }
  console.log(finalPrice)
  return userType == 1 ? finalPrice * estate.discount * 100 : finalPrice * 100
}
function md5(s) {
  return crypto.createHash('md5').update(String(s)).digest('hex')
}

function jwtDecoded(req) {
  let token = req.get('Authorization')
  console.log(token + '------')
  if (token.indexOf('Bearer') >= 0) {
    token = token.replace('Bearer ', '')
  }
  return jwt.verify(token, jwt_options.PRIVATE_KEY)
}

function timeFormatter(timeStr) {
  let timeArr = timeStr.split(' ')
  return timeArr[0] + (timeArr[1] == '上午' ? ' 8:00' : ' 12:00')
}
function getRandomStr(n) {
  var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var res = ''
  for (var i = n; i > 0; i--) {
    res += str[Math.floor(Math.random() * str.length)]
  }
  return res
}
module.exports = {
  clocPrice,
  md5,
  jwtDecoded,
  timeFormatter,
  getRandomStr
}

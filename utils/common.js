/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2020-12-07 09:40:25
 * @LastEditTime: 2021-03-18 08:45:16
 * @FilePath: /server-api/utils/common.js
 * @Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
let { estate, jwt_options } = require('../config/env')
let crypto = require('crypto')
const jwt = require('./jwt')

function clocPrice(buildArea, isFirst, userType) {
  let finalPrice = 0
  // 是否是首次装修
  if (isFirst == '1') {
    if (Number(buildArea) >= 55 && Number(buildArea) <= 140) {
      finalPrice = 300 + (Number(buildArea) - 55) * 5
    } else if (Number(buildArea) > 140) {
      finalPrice = 300 + (140 - 55) * 5 + (Number(buildArea) - 140) * 7
    } else {
      finalPrice = 300
    }
  } else {
    if (
      Number(this.orderInfo.buildArea) >= 55 &&
      Number(this.orderInfo.buildArea) <= 140
    ) {
      finalPrice = 360 + (Number(this.orderInfo.buildArea) - 55) * 6
    } else if (Number(this.orderInfo.buildArea) > 140) {
      finalPrice =
        360 + (140 - 55) * 6 + (Number(this.orderInfo.buildArea) - 140) * 8
    } else {
      finalPrice = 360
    }
  }
  console.log(finalPrice)
  return userType == 1 ? finalPrice * estate.discount * 100 : finalPrice * 100
}
function md5(s) {
  return crypto.createHash('md5').update(String(s)).digest('hex')
}

function decoded(req) {
  let token = req.get('Authorization')
  if (token.indexOf('Bearer') === 0) {
    token = token.replace('Bearer', '')
  }
  return jwt.verify(token, jwt_options.PRIVATE_KEY)
}
module.exports = {
  clocPrice,
  md5,
  decoded
}

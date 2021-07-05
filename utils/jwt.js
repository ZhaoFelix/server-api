/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-03-17 13:06:21
 * @LastEditTime: 2021-07-05 09:34:28
 * @FilePath: /server-api/utils/jwt.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */

// 接口的jwt认证相关
const jwt = require('express-jwt')
const { jwt_options } = require('../config/env')

module.exports = jwt({
  secret: jwt_options.PRIVATE_KEY,
  credentialsRequired: true,
  algorithms: ['HS256']
}).unless({
  // 不进行安全认证的白名单
  path: ['/', '/v1.0/pc/login/login', '/v1.0/public/order/callback']
})

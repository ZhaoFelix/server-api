/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-03-17 13:06:21
 * @LastEditTime: 2021-03-17 13:31:33
 * @FilePath: /server-api/utils/jwt.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
const jwt = require('express-jwt')
const { jwt_options } = require('../config/env')

module.exports = jwt({
  secret: jwt_options.PRIVATE_KEY,
  credentialsRequired: true,
  algorithms: ['RS256']
}).unless({
  path: ['/', '/user/login']
})

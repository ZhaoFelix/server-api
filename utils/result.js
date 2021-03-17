/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-03-17 13:53:40
 * @LastEditTime: 2021-03-17 14:09:23
 * @FilePath: /server-api/utils/result.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
const { response_options } = require('../config/env')
class Result {
  constructor(data, message = '操作成功', options) {
    this.data = null
    if (arguments.length === 0) {
      this.message = '操作成功'
    } else if (arguments.length === 1) {
      this.message = data
    } else {
      this.data = data
      this.message = message
      if (options) {
        this.options = options
      }
    }
  }

  createResult() {
    if (!this.code) {
      this.code = response_options.CODE_SUCCESS
    }
    let base = {
      code: this.code,
      message: this.message
    }
    if (this.data) {
      base.data = this.data
    }
    if (this.options) {
      base = { ...base, ...this.options }
    }
    return base
  }
  json(res) {
    res.json(this.createResult())
  }
  success(res) {
    this.code = response_options.CODE_SUCCESS
    this.json(res)
  }

  fail(res) {
    this.code = response_options.CODE_ERROR
    this.json(res)
  }

  jwtError(res) {
    this.code = response_options.CODE_TOKEN_EXPIRED
    this.json(res)
  }
}

module.exports = Result

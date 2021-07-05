/*
 * @Author: Felix
 * @Email: felix@qingmaoedu.com
 * @Date: 2021-05-06 13:04:01
 * @LastEditTime: 2021-07-05 09:33:34
 * @FilePath: /server-api/utils/ossHelper.js
 * Copyright © 2019 Shanghai Qingmao Network Technology Co.,Ltd All rights reserved.
 */
const crypto = require('crypto')

class OssHelper {
  constructor(options) {
    this.accessKeyId = options.accessKeyId
    this.accessKeySecret = options.accessKeySecret
    this.timeOut = options.timeOut || 1
    this.maxSize = options.maxSize || 10
  }

  createUploadParams() {
    const policy = this.getPolicyBase64()
    const signature = this.signature(policy)
    return {
      OSSAccessKeyId: this.accessKeyId,
      policy: policy,
      signature: signature
    }
  }
  getPolicyBase64() {
    let date = new Date()
    // 设置policy过期时间
    date.setHours(date.getHours() + this.timeOut)
    let srcT = date.toISOString()
    const policyText = {
      expiration: srcT,
      conditions: [
        // 限制文件大小
        ['content-length-range', 0, this.maxSize * 1024 * 1024]
      ]
    }
    const policy = Buffer.from(JSON.stringify(policyText))
    return policy.toString('base64')
  }

  signature(policy) {
    return crypto
      .createHmac('sha1', this.accessKeySecret)
      .update(policy)
      .digest('base64')
  }
}

module.exports = OssHelper

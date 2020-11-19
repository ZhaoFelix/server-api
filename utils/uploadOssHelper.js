const crypto = require("crypto-js");

class MpUploadOssHelper {
  constructor(options) {
    this.accessKeyId = options.accessKeyId;
    this.accessKeySecret = options.accessKeySecret;
    this.timeOut = options.timeout || 1; // 限制参数的生效时间(单位：小时)。
    this.maxSize = options.maxSize || 10; // 限制上传文件大小(单位：MB)。
  }

  createUploadParams() {
    const policy = this.getPolicyBase64();
    const signature = this.signature(policy);
    return {
      OSSAccessKeyId: this.accessKeyId,
      policy: policy,
      signature: signature,
    };
  }

  getPolicyBase64() {
    let date = new Date();
    // 设置policy过期时间。
    date.setHours(date.getHours() + this.timeOut);
    let srcT = date.toISOString();
    const policyText = {
      expiration: srcT,
      conditions: [
        // 限制上传文件大小。
        ["content-length-range", 0, this.maxSize * 1024 * 1024],
      ],
    };
    const buffer = new Buffer(JSON.stringify(policyText));
    return buffer.toString("base64");
  }

  signature(policy) {
    return crypto.enc.Base64.stringify(
      crypto.HmacSHA1(policy, this.accessKeySecret)
    );
  }
}

module.exports = MpUploadOssHelper;
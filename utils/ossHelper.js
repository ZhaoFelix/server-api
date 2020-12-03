const crypto = require("crypto")

class OssHelper {
    constructor(options){
     this.accessKeyId = options.accessKeyId
     this.accessKeySecret = options.accessKeySecret
     this.timeOut = options.timeOut
     this.maxSize = options.maxSize   
    }

    createUploadParams() {
        const policy = this.getPolicyBase64()
        const signature = this.signature(policy)
       
        return {
            OSSAccessKeyId: this.accessKeyId,
            policy: policy,
            signature: signature, 
        }
    }
    getPolicyBase64(){
        let date = new Date()
        // 设置policy过期时间
        date.setHours(date.getHours() + this.timeOut)
        let srcT = date.toISOString()
        const policyText = {
            expiration:srcT,
            conditions:[
                // 限制文件大小
                ["content-length-range",0,this.maxSize*1024*1024]
            ]
        }
        const policy = Buffer.from(JSON.stringify(policyText)).toString('base64')
        return policy
    }

    signature(policy){
        return crypto.createHmac('sha1', this.accessKeySecret).update(policy).digest("base64")
    }
}

module.exports = OssHelper
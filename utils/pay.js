let createHash = require('create-hash')
module.exports = {
    // 生成随机数
    createNonceStr(){
        return Math.random().toString(36).substr(2,15)
    },
    // 生成时间戳
    createTimeStamp(){
        return parseInt(new Date().getTime() / 1000) + ''
    },

    // 生成签名
    getSign(params,key){
        let string = this.raw(params) + '&key=' + key
        let sign = createHash('md5').update(string).digest('hex')
        return sign.toUpperCase()
    },

    // 生成系统的交易单号
    getTradeId(type = 'mp') {
        let date = new Date().getTime().toString()
        let text = ''
        let possible = '012345678'
        for (let i = 0;i<5;i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        return (type == 'mp' ? 'mp' : 'wx') + date + text
    },
    // Object装换成json并排序
    raw(args) {
        let keys = Object.keys(args).sort()
        let obj = {}
        keys.forEach((key) => {
            obj[key] = args[key]
        })
        let val = ''
        for (let k in obj) {
            val += '&' + k + '=' + obj[k]
        }
        return val.substr(1)
    }
}
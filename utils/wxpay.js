let env = require('../config/env')
let request = require('request')
let util = require('./pay.js')
let createHash = require('create-hash')
let xml = require('xml2js')
config = env.mch
module.exports = {
  order: function (
    appid,
    attach,
    body,
    openid,
    total_fee,
    notify_url,
    ip,
    detail,
    trade_no
  ) {
    return new Promise((resolve, reject) => {
      let nonce_str = util.createNonceStr()
      let out_trade_no =
        trade_no == undefined ? util.getTradeId('mp') : trade_no

      // 支付前需要先获取支付签名
      let sign = this.getPrePaySign(
        appid,
        attach,
        body,
        openid,
        total_fee,
        notify_url,
        ip,
        nonce_str,
        out_trade_no,
        detail
      )
      // 通过参数和签名组装xml数据，用以调用统一下单接口
      let sendData = this.wxSendData(
        appid,
        attach,
        body,
        openid,
        total_fee,
        notify_url,
        ip,
        nonce_str,
        out_trade_no,
        sign,
        detail
      )
      let self = this
      let url = 'https://api.mch.weixin.qq.com/pay/unifiedorder'
      request(
        {
          url,
          method: 'POST',
          body: sendData
        },
        function (err, response, body) {
          if (!err && response.statusCode == 200) {
            xml.parseString(body.toString('utf-8'), (error, res) => {
              if (!error) {
                let data = res.xml
                console.log('data:' + JSON.stringify(data))
                if (
                  data.return_code[0] == 'SUCCESS' &&
                  data.result_code[0] == 'SUCCESS'
                ) {
                  // 获取预支付的ID
                  let prepay_id = data.prepay_id || []
                  let payResult = self.getPayParams(
                    appid,
                    prepay_id[0],
                    out_trade_no
                  )
                  resolve(payResult)
                }
              }
            })
          } else {
            reject(util.handleFail(err))
          }
        }
      )
    })
  },
  // 生成预支付的签名
  getPrePaySign: function (
    appid,
    attach,
    body,
    openid,
    total_fee,
    notify_url,
    ip,
    nonce_str,
    out_trade_no,
    detail
  ) {
    console.log('生成签名')
    let params = {
      appid,
      attach,
      body,
      detail,
      mch_id: config.mch_id,
      nonce_str,
      notify_url,
      openid,
      out_trade_no,
      spbill_create_ip: ip,
      total_fee,
      trade_type: 'JSAPI'
    }
    let string = util.raw(params) + '&key=' + config.key
    let sign = createHash('md5').update(string).digest('hex')
    return sign.toUpperCase()
  },
  // 签名成功后 ，根据参数拼接组装XML格式的数据，调用下单接口
  wxSendData: function (
    appid,
    attach,
    body,
    openid,
    total_fee,
    notify_url,
    ip,
    nonce_str,
    out_trade_no,
    sign,
    detail
  ) {
    let data =
      '<xml>' +
      '<appid><![CDATA[' +
      appid +
      ']]></appid>' +
      '<attach><![CDATA[' +
      attach +
      ']]></attach>' +
      '<body><![CDATA[' +
      body +
      ']]></body>' +
      '<mch_id><![CDATA[' +
      config.mch_id +
      ']]></mch_id>' +
      '<detail><![CDATA[' +
      detail +
      ']]></detail>' +
      '<nonce_str><![CDATA[' +
      nonce_str +
      ']]></nonce_str>' +
      '<notify_url><![CDATA[' +
      notify_url +
      ']]></notify_url>' +
      '<openid><![CDATA[' +
      openid +
      ']]></openid>' +
      '<out_trade_no><![CDATA[' +
      out_trade_no +
      ']]></out_trade_no>' +
      '<spbill_create_ip><![CDATA[' +
      ip +
      ']]></spbill_create_ip>' +
      '<total_fee><![CDATA[' +
      total_fee +
      ']]></total_fee>' +
      '<trade_type><![CDATA[JSAPI]]></trade_type>' +
      '<sign><![CDATA[' +
      sign +
      ']]></sign>' +
      '</xml>'

    return data
  },
  getPayParams: function (appId, prepay_id, trade_no) {
    let params = {
      appId,
      timeStamp: util.createTimeStamp(),
      nonceStr: util.createNonceStr(),
      package: 'prepay_id=' + prepay_id,
      signType: 'MD5'
    }
    let paySign = util.getSign(params, config.key)
    params.paySign = paySign
    params.tradeNo = trade_no
    return params
  }
}

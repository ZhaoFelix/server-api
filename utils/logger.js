var logger = require('morgan')
var fileStreamRotator = require('file-stream-rotator')
var moment = require('moment')
var accessLogStream = fileStreamRotator.getStream({
  filename: './logs/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: 'YYYY-MM-DD'
})

function formatLog(tokens, req, res) {
  //   console.log(tokens)
  return [
    moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
    tokens['remote-addr'](req, res),
    tokens['remote-user'](req, res),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    decodeURI(tokens.url(req, res)),
    JSON.stringify(req.body),
    tokens.res(req, res, 'content-length'),
    '-',
    // 响应时间
    tokens['response-time'](req, res),
    'ms',
    // 浏览器信息
    tokens['user-agent'](req, res)
  ].join(' ')
}
const accessLog = logger(
  function (tokens, req, res) {
    return formatLog(tokens, req, res)
  },
  {
    stream: accessLogStream
  }
)

var accessLogStreamErr = fileStreamRotator.getStream({
  filename: './logs/access-error-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: 'YYYY-MM-DD'
})
const accessLogErr = logger(
  function (tokens, req, res) {
    return formatLog(tokens, req, res)
  },
  {
    stream: accessLogStreamErr,
    // 但状态码小于400时，不进行日志记录
    skip: function (req, res) {
      return res.statusCode < 400
    }
  }
)

module.exports = { accessLog, accessLogErr, logger }

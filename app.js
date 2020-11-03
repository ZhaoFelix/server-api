var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//  var logger = require('morgan');
var logger = require('./utils/logger')
var cors = require('cors')

var indexRouter = require('./routes/index')

var app = express();

// 前端模板引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 配置日志格式
// 开发环境下的日志格式
if (process.env.NODE_ENV == 'development') {
  app.use(
    logger.logger('dev', {
      stream: process.stdout
    })
  )
}
// 生产环境下的日志格式
else {
  app.use(logger.logger('combined'))
}

// 日志写入
app.use(logger.accessLog)
app.use(logger.accessLogErr)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 解决跨域问题
app.use(cors())

// 路由设置，导入路由入口文件index.js
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

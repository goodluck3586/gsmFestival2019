var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const helmet = require('helmet')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routing modules
var indexRouter = require('./routes/index');
var studentRouter = require('./routes/student');
var teacherRouter = require('./routes/teacher');

// middleware
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  // 파비콘 무시: app.use('/favicon.ico', () => {});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(helmet())
app.use(session({           // req.session 객체를 추가한다.
  HttpOnly:true,
  secret: 'dongyun2',   // 비밀값, 버전관리를 할 때 업로드하지 않아야 한다.
  resave: false,            // 나중에 이해 가능
  saveUninitialized: true,   // 세션이 필요하기 전까지는 세션을 구동시키지 않는다(true),  무조건 구동(false) -> 서버에 부담
  store: new MongoStore({
    url: 'mongodb://localhost:27017/session'
    ,ttl : 60*10   // 세션 유효기간 초 단위. 60초*10분
    // ,autoRemove : 'interval' // 주기적으로 제거
    // ,autoRemoveInterval: 1 // 분 단위
  })
}))

// routing
app.use('/', indexRouter);
app.use('/goout', studentRouter);     // student route
app.use('/teacher', teacherRouter);   // teacher route

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

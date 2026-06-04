var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 디폴트 페이지 라우터
var indexRouter = require('./routes/index');

// 유저 관련 라우터
var usersRouter = require('./routes/users');

// 게시글 관련 라우터
var postsRouter = require("./routes/posts");

// 학사 관련 라우터
var studentsRouter = require('./routes/haksa/students');
var professorsRouter = require('./routes/haksa/professors');
var coursesRouter = require('./routes/haksa/courses');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 경로 지정
// 디폴트 경로
app.use('/', indexRouter);

// 유저 관련 경로
app.use('/users', usersRouter);

// 게시글 관련 경로
app.use('/posts', postsRouter);

// 학사 관련 경로
app.use('/haksa/stu', studentsRouter);
app.use('/haksa/pro', professorsRouter);
app.use('/haksa/cou', coursesRouter);

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

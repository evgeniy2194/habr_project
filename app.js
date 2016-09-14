var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'public/tpl/index.html'));
});

app.get('/auth/getUser', function(req, res, next){
    /**
     *  Достаем пользователя с базы
     */
    if(res.cookie.login == 'test' && res.cookie.hash == 'test'){
        res.json({
            login: 'test',
            hash: 'test'
        });
    } else {
        res.send({});
    }
});

app.post('/auth/logout', function(req, res, next){
    res.cookie.login = '';
    res.cookie.hash = '';
});

//Авторизация через facebook
app.post('/auth/facebook', function(req, res, next){
    var accessToken = req.body.accessToken;
    var profileFields = ['id', 'first_name', 'last_name', 'link', 'gender', 'picture', 'email'];
    var request = require('request');

    request({
        url: 'https://graph.facebook.com/me?access_token=' + accessToken + '&fields=' + profileFields.join(','),
        method: 'GET',
        json: true
    },function (error, response, body) {
        /**
         * Тут пишем данные в базу, сохраняем сесси, куки и т
         */
        res.cookie.login = 'test';
        res.cookie.hash = 'test';

        res.json(body);
    });
});

//Авторизация с помощью Вконтакте
app.post('/auth/vk', function(req, res, next) {

    var secretKey = '( . )( . )'; //Защищенный ключ приложения

    var sig = req.body.sig,
        expire = req.body.expire,
        mid = req.body.mid,
        secret = req.body.secret,
        sid = req.body.sid,
        user = req.body.user;

    var str = "expire=" + expire + "mid=" + mid + "secret=" + secret + "sid=" + sid + secretKey;
    var hash = crypto.createHash('md5').update(str).digest('hex');

    //Пользователь наш
    if(hash == sig){
        /**
         * Тут пишем данные в базу, сохраняем сесси, куки и т.д
         */
        res.cookie.login = 'test';
        res.cookie.hash = 'test';

        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message, error: err });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
});

module.exports = app;
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(
	session({
		secret: 'asadlfkj!@#!@#dfgasdg',
		resave: false,
		saveUninitialized: true,
		store: new FileStore()
	})
);

/*
flash는 세션을 사용하여, session이후에 적어줘야 한다,
*/
app.use(flash());

var authData = {
	email: 'egoing777@gmail.com',
	password: '111111',
	nickname: 'egoing'
};

/* 
passport 설치
*/
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize()); // app 동작시 초기화된 passport를 사용하고
app.use(passport.session()); // session을 passport의 로그인 인증 방식으로 사용한다

/* 
In order to support login sessions, 
Passport will serialize and deserialize user instances to and from the session.
세션을 처리하는 방법
*/
passport.serializeUser(function(user, done) { //user는 로그인 성공 시 들어온 user정보. 해당 정보를 session값에 초기 저장하는 것이 serizlizeUser
	done(null, user.email) //user.email은 사용자의 식별자. done의 두번째 인자로 전해주기로 약속. 식별자 값은 session데이터에 user값으로 간다.
});

passport.deserializeUser(function(id, done) { //로그인 이후 페이지에 방문할때마다 호출 로그인한 사용자인지를 더블체크하는 코드.
	done(null, authData); //authData는 유저 확인을 위한 데이터. DB이면 유저 데이터를 보낼 수 있게 확인하는 정보. serialize에서 저장된 user값과 비교.
});

/* 
사용자가 로그인을 시도할때, 성공/실패를 확인하는 부분. 사용자가 로그인을 시도할때마다, 두번째 콜백함수가 실행.
*/
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'pwd'
		},
		function(username, password, done) {
			if (username === authData.email) {
				if (password === authData.password) {
					return done(null, authData);
				} else {
					return done(null, false, { message: 'Incorrect password.' });
				}
			} else {
				return done(null, false, { message: 'Incorrect username.' });
			}
		}
	)
);

/* 
passport가 사용자의 로그인을 처리하기 위한 방법. 전달된 정보를 passport가 받아서 성공이면 root로 실패면 login페이지로 보내기.
*/
app.post(
	'/auth/login_process',
	passport.authenticate('local', { //로그인 방식 중 id & pw 전략
		successRedirect: '/',
		failureRedirect: '/auth/login',
		failureFlash: true
	})
);

app.get('*', function(request, response, next) {
	fs.readdir('./data', function(error, filelist) {
		request.list = filelist;
		next();
	});
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
	res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
	res.status(500).send('Something broke!');
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

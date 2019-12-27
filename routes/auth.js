var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

router.get('/login', function(request, response) {
	var fmsg = request.flash();
	var feedback = '';
	if (fmsg.error) {
		feedback = fmsg.error[0];
	}
	var title = 'WEB - login';
	var list = template.list(request.list);
	var html = template.HTML(
		title,
		list,
		`
    <div>${feedback}</div>
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `,
		''
	);
	response.send(html);
});

/* 
로그아웃 기능
*/
router.get('/logout', function(request, response) {
	request.logout();
	request.session.save(function() {
		response.redirect('/');
	});
});

module.exports = router;

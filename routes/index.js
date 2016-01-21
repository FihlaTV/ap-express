var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//for pages
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/list', function(req, res, next) {
	res.render('list');
});

router.get('/tag/:tagname', function(req, res, next) {
	res.render('tag');
});

router.get('/browse', function(req, res, next) {
	res.render('browseTag');
});

router.get('/question/:questionID', function(req, res, next) {
	res.render('question');
});

router.get('/record', function(req, res, next) {
	res.render('record');
});

//signup
router.post('/register', function(req, res, next) {
	var db = req.db,
		collection = db.get('usercollection'),
		user = req.body,
		md5 = crypto.createHash('md5'),
		password = md5.update(user.password).digest('base64');

	collection.ensureIndex('username', {
		unique: true
	});
	collection.ensureIndex('email', {
		unique: true
	});
	collection.insert({
		"username": user.username,
		"password": password,
		"email": user.email,
		"role": user.role
	}, function(err, doc) {
		if (err) {
			// If it failed, return error
			console.log(err)
			var errorName, errorEmail=false;
			if (err.code = 11000 && err.err.indexOf('username')>-1) {
				errorName = true;
			};
			if (err.code = 11000 && err.err.indexOf('email')>-1) {
				errorEmail = true;
			};
			return res.send({
				success: false,
				loginAs: 0, //0 as not login, 1 as student, 2 as instructor
				username: "",
				errors: {
					errorName: errorName,
					errorEmail: errorEmail
				}
			})
		} else {
			return res.send({
				success: true,
				loginAs: user.role,
				username: user.username,
				errors: {
					errorName: false,
					errorEmail: false
				}
			})
		}
	});

});

//login
router.post('/login', function(req, res, next) {
	var db = req.db,
		collection = db.get('usercollection'),
		user = req.body,
		md5 = crypto.createHash('md5'),
		password = md5.update(user.password).digest('base64');

	collection.findOne({
		"username": user.username
	}, function(err, theUser) {
		if (err) {
			// If it failed, return error
			res.send("There was a problem adding the information to the database.");
		} else {
			if (theUser.password == password) {
				return res.send({
					success: true,
					username: theUser.username,
					loginAs: theUser.role,
					errors: {
						errorAuthen: false,
					}
				})
			} else {
				return res.send({
					success: false,
					errors: {
						errorAuthen: true
					}
				})
			}
		}
	});

});

module.exports = router;
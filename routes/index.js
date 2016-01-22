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
	var tagname = req.params.tagname.toLowerCase(),
		db = req.db,
		tagcollection = db.get('tagcollection'),
		canEdit = req.cookies.canEdit;

	tagcollection.findOne({
		"tag": tagname
	}, function(err, theTag) {
		if (err) {
			res.redirect("/browse");
		} else {
			if (theTag != null) {
				res.render('tag');
			} else {
				res.redirect("/browse");
			}
		}
	});
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
	}, function(err, theUser) {
		if (err) {
			// If it failed, return error
			var errorName, errorEmail = false;
			if (err.code = 11000 && err.err.indexOf('username') > -1) {
				errorName = true;
			};
			if (err.code = 11000 && err.err.indexOf('email') > -1) {
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
			// req.session.userId = theUser._id;
			res.cookie('userId', theUser._id, {
				maxAge: 3 * 60 * 60 * 1000
			});
			var canEdit = user.role == "2" ? true : false;
			res.cookie('canEdit', canEdit, {
				maxAge: 3 * 60 * 60 * 1000
			});

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
				// req.session.userId = theUser._id;
				// console.log(req.sessionID);
				res.cookie('userId', theUser._id, {
					maxAge: 3 * 60 * 60 * 1000
				});
				var canEdit = theUser.role == "2" ? true : false;
				res.cookie('canEdit', canEdit, {
					maxAge: 3 * 60 * 60 * 1000
				});

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

//logout
router.get('/logout', function(req, res, next) {
	console.log("[data]")
	res.clearCookie('userId');
	res.send({
		loginAs: 0
	});
});

// init info
router.get('/initUser', function(req, res, next) {
	var userId = req.cookies.userId;
	var db = req.db,
		collection = db.get('usercollection');

	if (userId) {
		collection.findOne({
			"_id": userId
		}, function(err, theUser) {
			if (err) {
				return res.send("not login");
			} else {
				return res.send({
					success: true,
					username: theUser.username,
					loginAs: theUser.role,
				})

			}
		});
	};

});

//get tag
router.get('/getTag/:tagname', function(req, res, next) {
	var tagname = req.params.tagname.toLowerCase(),
		db = req.db,
		tagcollection = db.get('tagcollection'),
		canEdit = req.cookies.canEdit;

	if (tagname=="new"&&canEdit==false) {
		return res.redirect('/browse');
	};

	tagcollection.findOne({
		"tag": tagname
	}, function(err, theTag) {
		if (err) {
			return res.redirect('/browse');
		} else {
			if (theTag != null) {
				return res.send({
					isNew: tagname=="new",
					canEdit: canEdit,
					tag: theTag.tag,
					abstract: theTag.abstract,
					intro: theTag.intro
				})
			} else {
				res.redirect("/browse");
			}
		}
	});
});

//save tag
router.post('/saveTag', function(req, res, next) {
	var db = req.db,
		collection = db.get('tagcollection'),
		tag = req.body;

	console.log(tag);

	// if (tagname=="new") {
	// 	return res.send("can't modify new");
	// };

	collection.findOne({
		"tag": tag.tag.toLowerCase()
	}, function(err, theTag) {
		if (err) {
			res.send("There was a problem adding the information to the database.");
		} else {
			if (theTag) {
				collection.update({
					"tag": tag.tag.toLowerCase()
				}, {
					"tag": tag.tag.toLowerCase(),
					"abstract": tag.abstract,
					"intro": tag.intro
				})

				return res.send({
					success: true
				})

			} else {
				// new tag
				collection.insert({
					"tag": tag.tag.toLowerCase(),
					"abstract": tag.abstract,
					"intro": tag.intro
				})
				return res.send({
					success: true
				})

			}
		}
	});

});

module.exports = router;
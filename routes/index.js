var express = require('express'),
	router  = express.Router(),
	passport = require('passport'),
	User = require('../models/user'),
	Campground = require('../models/campground');

router.get('/', function(req,res){
	res.render('landing');
});

router.get('/register', function(req,res){
	res.render('register');
});

router.post('/register', function(req,res){
	var newUser = new User(
		{
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			avatar: req.body.avatar,
			email: req.body.email
		});

	if(req.body.adminCode === 'secretcode123'){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash('error', err.message);
			return res.redirect('register');
		}
		passport.authenticate('local')(req,res,function(){
			req.flash('success', "Welcome to YelpCamp " + user.username);
			res.redirect('/campgrounds');
		});
	});
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome back, " + req.body.username + "!"
    })(req, res);
});

//logout route
router.get('/logout', function(req,res){
	req.logout();
	req.flash('success', 'You have succesfully logged out')
	res.redirect('/campgrounds');
});

//USER PROFILES
router.get("/users/:id", function(req,res){
	User.findById(req.params.id, function(err,foundUser){
		if(err){
			req.flash("error", "Something went wrong.")
			res.redirect("/");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campground){
			if(err){
			req.flash("error", "Something went wrong.")
			res.redirect("/");
		}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		});
		
	})
});

module.exports = router;
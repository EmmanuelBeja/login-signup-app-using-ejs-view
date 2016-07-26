var express= require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');

var User = require('../models/user');


//login
router.get('/login', function(req,res){
  res.render('login');
});

//profile page
router.get('/index', function(req, res) {
    res.render('index');
});


//get Register
router.get('/register', function(req,res){
  var errors = "";
  var utaken = "";
  res.render('register', {
     errors : errors,
     utaken : utaken,
   });
});


//Register user
router.post('/register', function(req, res){
  var fname=req.body.fname;
  var lname=req.body.lname;
  var email=req.body.email;
  var phonenumber=req.body.phonenumber;
  var username=req.body.username;
  var password=req.body.password;
  var password2=req.body.password2;

  //validation
  req.checkBody('fname','First Name is required').notEmpty();
  req.checkBody('lname','Last Name is required').notEmpty();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('phonenumber','Phone number is required').notEmpty();
  req.checkBody('phonenumber','Phone Number is not valid').isNumeric();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password', 'Password should be 8 to 20 characters').len(8, 20);
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
      if (errors){
        var msg = errors.msg;
        var utaken = "";
        res.render('register', {
          errors : errors,
          msg : msg,
          utaken : utaken,
      });
      console.log(errors);
      }
      else {
        User.getUserByUsername(username, function(err, user){
          if(err) throw err;
          if(user){
            var utaken = "Username taken";
            var errors = "";
            var msg = "";
            res.render('register', {
              errors : errors,
              msg:msg,
              utaken : utaken,
          });
          }else {
             console.log('You have no register errors');
             User.find
             var newUser=new User({
               fname: fname,
               lname: lname,
               username: username,
               email: email,
               phonenumber: phonenumber,
             });
             User.createUser(newUser,function(err, user){
               if (err) throw err;
               console.log(user);
             });
             req.flash('success_msg', 'you are registered and now can login');
             res.redirect('/users/login');
          }
          });
      };
    });


//pasport local
passport.use(new LocalStrategy(
  function(username, password, done) {
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null,false,{message:'Unknown user'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      }
      else{
        return done(null, false,{message:'Invalid password'});
      }
    });
  });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

router.post('/login',
  passport.authenticate('local', {successRedirect:'/',failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

  router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
module.exports = router;

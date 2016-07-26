var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//User schema
var UserSchema=mongoose.Schema({
  username:{
    type:String,
    index:true
  },
  password:{
    type:String
  },
  email:{
    type:String
  },
  phonenumber:{
    type:Number
  },
  fname:{
    type:String
  },
  lname:{
    type:String
  },
  position:{
    type:String
  },
  bio:{
    type:String
  },
  title:{
    type:String
  },
  link:{
    type:String
  },
  github:{
    type:String
  },
  gitlab:{
    type:String
  },
  linkedin:{
    type:String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10,function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}
module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  });
}

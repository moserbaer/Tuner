const mongoose = require('mongoose');
const bcrypt = require('bcrypt');//used for hashing
const jwt = require('jsonwebtoken');//used for creating unique hashes webtoken
require('dotenv').config(); // to access env variable
const SALT_I = 10;
// user schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name:{
    type: String,
    required: true,
    maxlength: 100
  },
  lastname:{
    type: String,
    required: true,
    maxlength: 100
  },
  cart: {
    type: Array,
    default:[]
  },
  history: {
    type: Array,
    default:[]
  },
  role:{
    type:Number,
    default:0
  },
  token:{
    type:String
  }
});

///////////////////////////////////////
//=========PASSWORD HASHING==========//
//////////////////////////////////////
//before saving schema, do this
userSchema.pre('save',function(next){
  var user = this; //ES5 thing

if(user.isModified('password')){// this is used to check if new registration is done or password is modified then do hash again else not
  bcrypt.genSalt(SALT_I,function(err,salt){ //generating salt
    if(err) return next(err); //here next means go to the err code which is writen in post request of user model
    bcrypt.hash(user.password,salt,function(err,hash){//generate hash of password using salt
      if(err) return next(err);//here next means go to the err code which is writen in post request of user model
      user.password = hash; //hash password saved
      next();//now password has been hashed then go to normal code without error
    });
  })
}else {
  next(); // if try to change stuff other than password then go to normal code without error
}

});


///////////////////////////////////////
//=======user schema methods=========//
//////////////////////////////////////
userSchema.methods.comparepassword = function(candidatepassword,callback){
  bcrypt.compare(candidatepassword,this.password,function(err,isMatch){ //compare password
    if(err) return callback(err); // if error do err callback
    callback(null,isMatch); // if not error do callback without error
  })
}

userSchema.methods.generateToken = function(callback){
var user = this; // use to get super function user from server page. super function here is the function calling this method
var token = jwt.sign(user._id.toHexString(),process.env.SECRET); // unique webtoken created

user.token = token;
user.save(function(err,user){ //save token
  if(err) return callback(err); // if error do err callback
  callback(null,user);  // if not error do callback without error
})
}
//=============================
//middleware methods
//=============================
userSchema.statics.findByToken = function(token,callback){
  var user = this; // get from parent function

  //decode the token to get user_id and find it in database
  jwt.verify(token,process.env.SECRET,function(err,decode){
    user.findOne({"_id":decode,"token":token},function(err,user){
      if(err) return callback(err);
      callback(null,user);
    })
  })
}


const User = mongoose.model('User',userSchema);
module.exports = { User }

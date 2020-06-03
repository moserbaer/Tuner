const {User} = require('./../models/user');


// To check authentication of pages valid or not

const auth = (req,res,next) =>{
  const token = req.cookies.w_auth; // check by token
  //user defined method declared in schema file
  User.findByToken(token,(err,user)=>{
    if(err) throw err;
    if(!user) return res.json({
      isAuth:false,
      error: true
    });
    req.token = token;
    req.user = user;
    next();//this next for parent function who calls it
  })
}

module.exports = {auth};

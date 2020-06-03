//====== To check admin or not =======//
const admin = (req,res,next) =>{
  if(req.user.role === 0){ // if user
    return res.send('you are not allowed, get out now')
  }
  // passed for admin
  next();
}

module.exports = { admin };

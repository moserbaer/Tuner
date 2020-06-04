const express = require('express');
const bodyParser = require('body-parser');//importing json file from other pages
const cookieParser = require('cookie-parser');
const formidable = require('express-formidable')
const cloudinary = require('cloudinary')
const async = require('async');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config(); // to access env variables

//============================
//mongoose middleware
//===========================
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));
///////////////////////////
//body parser middleware//
/////////////////////////
app.use(bodyParser.urlencoded({extended:true}));//to pass query strings
app.use(bodyParser.json());// to pass JSON file
app.use(cookieParser());

app.use(express.static('client/build'));

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET
})
/////////////////
//    MODELS    //
/////////////////
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');
const { Payment } = require('./models/payment');
const { Site } = require('./models/site');
//=================================
//      user Middlewares
//=================================
const {auth} = require('./middleware/auth');//import auth middleware
const {admin} = require('./middleware/admin');//import admin middleware

//==================================
//            PRODUCT
//==================================


app.post('/api/product/shop',(req,res)=>{

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for(let key in req.body.filters){
        if(req.body.filters[key].length >0 ){
            if(key === 'price'){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }else{
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    findArgs['publish'] = true;

    Product.
    find(findArgs).
    populate('brand').
    populate('wood').
    sort([[sortBy,order]]).
    skip(skip).
    limit(limit).
    exec((err,articles)=>{
        if(err) return res.status(400).send(err);
        res.status(200).json({
            size: articles.length,
            articles
        })
    })
})




//  get product by passing query
app.get('/api/product/articles',(req,res)=>{
  let order = req.query.order ? req.query.order : 'asc'; // order came from url means query string
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';// sortBy came from url means query string
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;// limit came from url means query string


  Product.find().
  populate('brand'). // we again populate brand and wood beacuse in database it have only there ids
  populate('wood').
  sort([[sortBy,order]]).
  limit(limit).
  exec((err,articles)=>{ //exec to execute next statemnts
    if(err) return res.status(400).send(err);
    res.status(200).send(articles);
  })
})



//======= get product by id ============//
app.get('/api/product/articles_by_id',(req,res)=>{
  let type = req.query.type;//query comes from body bodyParser
  let items = req.query.id;
  if(type === "array"){
    let ids = req.query.id.split(',');
    items = [];
    items = ids.map(item=>{
      return mongoose.Types.ObjectId(item)
    })
  }

  Product.
  find({'_id':{$in:items}}).
  populate('brand').  /// this to get all info of that brand id which we entered while posting brand//it is a kind of relationship between two tables
  populate('wood').   /// all info of that wood_id which we entered while posting wood//
  exec((err,doc)=>{  // this is used when item can be array and return multiple docs
    return res.status(200).send(doc)
  })
});

//=========== post product =============//
app.post('/api/product/article',auth,admin,(req,res)=>{
    const product = new Product(req.body);

    product.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            article: doc
        })
    })
})



//==================================
//            WOODS
//==================================

//===== To register new wood ==========//
app.post('/api/product/wood',auth,admin,(req,res)=>{
  const wood = new Wood(req.body);
  wood.save((err,doc)=>{
    if(err) return res.json({success:false,err});
    res.status(200).json({
      success:true,
      wood: doc
    })
  })
});
//====== To get all wood present in database ================//
app.get('/api/product/woods',(req,res)=>{
  Wood.find({},(err,woods)=>{
    if(err) return res.status(400).send(err);
    res.status(200).send(woods);
  })
})

//==================================
//            BRAND
//==================================

//======== To enter brand name ========//
app.post('/api/product/brand',auth,admin,(req,res)=>{ // user is authenticated or not and it is admin or not
  const brand = new Brand(req.body); //get brand name from body side
  // save brand to brand model
  brand.save((err,doc)=>{
    if(err) return res.json({success:false,err});
    res.status(200).json({
      success:true,
      brand: doc
    })
  })
})

//======= To get all brands in database =======//
app.get('/api/product/brands',(req,res)=>{
  Brand.find({},(err,brands)=>{
    if(err) return res.status(400).send(err);
    res.status(200).send(brands);
  })
})

//==================================
//            USERS
//==================================

app.get('/api/users/auth',auth,(req,res)=>{
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history
  })
});


app.post('/api/users/register',(req,res)=>{
  const user = new User(req.body);//creating new user models
  //saving model to mongodb
  user.save((err,doc)=>{
    if(err) return res.json({success:false,err});
    //if not error
    res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login',(req,res)=>{
  //find email
  User.findOne({'email': req.body.email},(err,user)=>{
    if(!user) return res.json({loginSuccess:false,message:'Auth fail, Email not found'}); //email not found

    user.comparepassword(req.body.password,(err,isMatch)=>{ // calling password match method
      if(!isMatch) return res.json({loginSuccess:false,message:'Wrong password'}); // if password dont Match
      //========= if password matches======//
      user.generateToken((err,user)=>{ // if password match generate token
        if(err) return res.status(400).send(err); // token error
        res.cookie('w_auth',user.token).status(200).json({ // save token as cookie, w_auth will be the name of cookie
          loginSuccess: true
        })
      })
    })
  })
})


app.get('/api/users/logout',auth,(req,res)=>{
  User.findOneAndUpdate(
    {_id:req.user._id},
    {token: ''},
    (err,doc)=>{
      if(err) return res.json({success:false,err});
      return res.status(200).send({
        success: true
      })
    }
  )
})


app.post('/api/users/uploadimage',auth,admin,formidable(),(req,res) => {
  cloudinary.uploader.upload(req.files.file.path,(result) => {
    console.log(result);
    res.status(200).send({
      public_id: result.public_id,
      url: result.url
    })
  },{
    public_id: `${Date.now()}`,
    resource_type: 'auto'
  })
})

app.get('/api/users/removeimage',auth,admin,(req,res)=>{
  let image_id = req.query.public_id;
  cloudinary.uploader.destroy(image_id,(error,result) => {
    if(error) return res.json({succes:false,error});
    res.status(200).send('ok');
  })
})


app.post('/api/users/addToCart',auth,(req,res)=>{

    User.findOne({_id: req.user._id},(err,doc)=>{
        let duplicate = false;

        doc.cart.forEach((item)=>{
            if(item.id == req.query.productId){
                  duplicate = true;
            }
        })

        if(duplicate){
            User.findOneAndUpdate(
                {_id: req.user._id, "cart.id":mongoose.Types.ObjectId(req.query.productId)},
                { $inc: { "cart.$.quantity":1 } },
                { new:true },
                ()=>{
                    if(err) return res.json({success:false,err});
                    res.status(200).json(doc.cart)
                }
            )
        } else {
            User.findOneAndUpdate(
                {_id: req.user._id},
                { $push:{ cart:{
                    id: mongoose.Types.ObjectId(req.query.productId),
                    quantity:1,
                    date: Date.now()
                } }},
                { new: true },
                (err,doc)=>{
                    if(err) return res.json({success:false,err});
                    res.status(200).json(doc.cart)
                }
            )
        }
    })
})

app.get('/api/users/removeFromCart',auth,(req,res) => {

  User.findOneAndUpdate(
    {_id: req.user._id},
    { "$pull":
        {"cart": {"id": mongoose.Types.ObjectId(req.query._id)}}
    },
    { new: true},
    (err,doc)=>{
      let cart = doc.cart;
      let array = cart.map(item=>{
        return mongoose.Types.ObjectId(item.id)
      });

      Product.
      find({'_id':{ $in: array }}).
      populate('brand').
      populate('wood').
      exec((err, cartDetail) => {
        return res.status(200).json({
          cartDetail,
          cart
        })
      })

    }
  );
})

app.post('/api/users/successBuy',auth,(req,res) => {

  let history = [];
  let transactionData = {}
  //user history
  req.body.cartDetail.forEach((item) => {
    history.push({
        dateOfPurchase: Date.now(),
        name: item.name,
        brand: item.brand.name,
        id: item._id,
        price: item.price,
        quantity: item.quantity,
        paymentID: req.body.paymentData.paymentID
    })
  });

  //payments dash
  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email
  }

  transactionData.data = req.body.paymentData;
  transactionData.product = history;

  USer.findOneAndUpdate(
    {_id: req.user._id},
    { $push:{history:history}, $set:{ cart:[]}},
    { new: true},
    (err,user) => {
      if (err) return res.json({success: false,err});

      const payment = new Payment(transactionData);
      payment.save((err,doc) => {
        if (err) return res.json({success: false,err});
        let products = [];
        doc.product.forEach(item =>{
          products.push({id:item.id,quantity:item.quantity})
        })
        async.eachSeries(products,(item,callback) => {
          Product.update(
            {_id: item.id},
            { $inc:{
              "sold": item.quantity
            }},
            {new:false},
            callback
          )
        },(err) => {
          if (err) return res.json({success: false,err});
          res.status(200).json({
            success: true,
            cart: user.cart,
            cartDetail:[]
          })
        })
      })
    }
  )
})

app.post('/api/users/update_profile',auth,(req,res)=>{

    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$set": req.body
        },
        { new: true },
        (err,doc)=>{
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success:true
            })
        }
    );
})

//==================================
//            SITE
//==================================

app.get('/api/site/site_data',(req,res) => {
  Site.find({},(err,site) => {
    if(err) return res.status(400).send(err);
    res.status(200).send(site[0].siteInfo)
  });
});

app.post('/api/site/site_data',auth,admin,(req,res) => {
  Site.findOneAndUpdate(
    {name: 'Site'},
    {"$set": {siteInfo: req.body }},
    {new: true},
    (err,doc) => {
      if(err) return res.json({success:false,err});
      res.status(200).send({
        success: true,
        siteInfo: doc.siteInfo
      })
    }
  )
})

//DEFAULT
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.get('/*',(req,res) => {
      res.sendfile(path.resolve(__dirname,'../client','build','index.html'))
    })
}


/////////////////////////////////
//========PORT CONNECTION=====//
///////////////////////////////
const port = process.env.PORT || 3002;

app.listen(port,()=>{
  console.log(`Server Running at ${port}`)
});

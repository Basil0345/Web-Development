var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers')

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {

  let userLog=req.session.user
  console.log(userLog);
  productHelpers.getAllProducts().then((product) => {
    res.render('User/view-products', { product, user: true,userLog });
  })
});

router.get('/login', function (req, res) {
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('User/login', { user: true,logErr:req.session.loginErr})
    req.session.loginErr=null

  }
})

router.get('/signup',function(req,res){
  res.render('User/signup',{user:true})
})

router.post('/signup',function(req,res){
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')

  })


})
router.post('/login',(req,res)=>{
  userHelpers.doLoginin(req.body).then((response)=>{
   if(response.status){
    req.session.loggedIn=true
    req.session.user=response.user
    res.redirect('/')
   }else{
    req.session.loginErr="Invalid username or password"
    res.redirect('/login')
   }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,(req,res)=>{
    let userId=req.session.user._id
    userHelpers.getCartProducts(userId).then((cartItems)=>{
      console.log(cartItems);
    })
    res.render('User/cart',{user:true})
 
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  let productId=req.params.id
  let userId=req.session.user._id
  userHelpers.addToCart(productId,userId).then(()=>{
    res.redirect('/')
  })
  
})

module.exports = router;

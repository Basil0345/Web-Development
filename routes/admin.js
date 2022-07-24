var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
const path = require("path")

//Admin Side



// object array

router.get('/', function(req, res, next) {
  producthelpers.getAllProducts().then((product)=>{
    console.log(product)
    res.render('admin/view-products',{user:false,product})

  })
});

router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})

router.post('/add-product',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)
  producthelpers.addProduct(req.body,(id)=>{

    let image=req.files.Image
    image.mv(path.resolve(__dirname,'../public/product-images/',id+'.jpg'),(err,done)=>{
      if(!err){
      res.render("admin/add-product")
      }else{
        console.log(err)
      }

    })
    
  })

})

module.exports = router;

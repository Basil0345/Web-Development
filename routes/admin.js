var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
const path = require("path")
var Handlebars = require('handlebars');
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


//Admin Side

router.get('/', function(req, res, next) {
  producthelpers.getAllProducts().then((product)=>{
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

router.get('/delete-product/:id',(req,res)=>{

  let proId=req.params.id
  producthelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })

})

router.get('/edit-product/:id',async(req,res)=>{
  let proId=req.params.id
  let product=await producthelpers.getProductDetail(proId)
    res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
   producthelpers.productUpdate(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let id=req.params.id
      let image=req.files.Image
      image.mv(path.resolve(__dirname,'../public/product-images/',id+'.jpg'))

    }
  })
})

module.exports = router;

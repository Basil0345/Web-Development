var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  productHelpers.getAllProducts().then((product)=>{
    console.log(product)
    res.render('user/view-products',{product,user:true});


  })

 

});

module.exports = router;

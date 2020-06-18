const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', checkAuthentication, function(req, res) {
  //console.log(req.cookies);
  res.redirect('/user');
});

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
      next();
    } else{
        res.redirect('/login');
    }
}



module.exports = router;

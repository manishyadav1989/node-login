var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(`users session ${req.session.uid}`)
    if(req.session.uid){
      res.render('dashboard', { title: 'Chat App', name:req.session.name});
    }
    else{
      res.render('index', { title: 'Test App', msg:""});
    }
});

module.exports = router;

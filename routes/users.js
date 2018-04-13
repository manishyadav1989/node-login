const express = require('express'),
    router = express.Router(),
    utils = require('./../utils');

/* GET users listing. */
router.post('/user/signup', function(req, res) {
    var properties = {
        'fullname':  { 'required': true, 'type': 'String' },
        'email':  { 'required': true, 'type': 'String' },
        'username': { 'required': true, 'type': 'String' },
        'password': { 'required': true, 'type': 'String' }
    },
    userData = {};

    if (!(userData = utils.validation(req.body, properties))) {
        res.render('index', { title: 'Test App', msg:"Please fill all required fields"});
        return false;
    }

    userData.password = utils.generateHash(userData.password);
    // validate user with exists user
    utils.db.collection('user').findOne({username:userData.username}, function(error, data){
        if(!error){
            if(data){
              res.render('index', { title: 'Test App', msg:"User alreay exists with "+ userData.username +" username"});
            }
            else{
                // store user data into mongo
                utils.db.collection('user').insert(userData, function(error, result){
                  if(error){
                    console.log(`data could not store into mongodb ${error}`)
                    res.render('index', { title: 'Test App', msg:"Signup Failed!"});
                  }
                  else{
                    res.render('index', { title: 'Test App', msg:"Signup Successfully!"});
                  }
                });
            }
          
        }
        else{
          console.log(`data could not store into mongodb ${error}`)
          res.render('index', { title: 'Test App', msg:"Signup Failed!"});
        }
    });
});
router.post('/user/signin', function(req, res) {
    var properties = {
        'username': { 'required': true, 'type': 'String' },
        'password': { 'required': true, 'type': 'String' }
    },
    user = {};

    if (!(user = utils.validation(req.body, properties))) {
        res.render('index', { title: 'Test App', msg:"Please fill all required fields"});
        return false;
    }
    
    user.password = utils.generateHash(user.password);
    // authenticate user
    utils.db.collection('user').findOne({username:user.username, password:user.password}, function(error, data){
      if(error){
        res.render('index', { title: 'Test App', msg:"Record not found!"});
      }
      else{
        if(data){
          req.session.uid = data._id;
          req.session.name = data.fullname;
          res.redirect('/');
        }
        else{
          res.render('index', { title: 'Test App', msg:"Incorrect username or password"});
        }
      }
    });
});

router.get('/user/logout', function(req, res) {
  if (req.session) {
    req.session.uid = null;
    req.session.name = null;
    req.session.destroy(function () {
    });
  }
  res.redirect('/');
});

module.exports = router;

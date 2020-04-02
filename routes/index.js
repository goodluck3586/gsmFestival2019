var express = require('express');
var router = express.Router();
var model = require('../models/DAO');
var auth = require('../lib/auth')
const crypto = require('crypto');

// index 페이지(계정을 검사하여 student와 teacher 화면으로 이동)
router.get('/', function(req, res, next) {
  if(req.session.isLogin){
    if(req.session.userType === 'student'){
      res.redirect('/goout');
    }else if(req.session.userType === 'teacher'){
      res.redirect('/teacher')
    }else{
      res.redirect('/');
    }
  }else{
    model.selectStudentsData(function(results){
      res.render('index', { title: 'GSM 외출관리', isOwner: auth.isOwner(req, res)});
    });
  }
});

// #region 로그인 처리
// *** login form page ***
router.get('/login', function(req, res, next){
  res.render('login', { title: 'Login', isOwner: auth.isOwner(req, res) });
});

// *** login 처리 ***
router.post('/login', function(req, res, next){
  var formData;
  if(req.body.email && req.body.password){
    formData = {email: req.body.email, password: req.body.password};
  }

  // session을 이용한 로그인
  model.loginProcess(formData, function(results){
    // DB에 email이 없는 경우(존재하지 않는 사용자) 처리
    if(results === undefined){
      console.log(`${formData.email}와 같은 사용자가 없습니다.`);
      res.redirect('/login');
    }else{
      const hash = crypto.createHash('sha512').update(formData.password).digest('base64');
      if(formData.email === results.id && hash === results.pwd){
        req.session.isLogin = true;
        req.session.userId = results.id;
        req.session.userName = results.name;
        req.session.userType = results.userType;
        if(results.class){
          req.session.grade = results.class.slice(0,1);
          req.session.class = results.class.slice(1,2);
        }
          
        for(var key in req.session){
          console.log(`req.session 데이터 : key(${key}), value(${req.session[key]})`)
        }
        
        // 세션이 저장되면 콜백함수 호출(세션 반영이 끝난후 리다이렉션 실행)
        req.session.save(function(err){
          if(req.session.userType === 'student'){
            res.redirect('/goout')
          }else if(req.session.userType === 'teacher'){
            res.redirect('/teacher')
          }else{
            res.redirect('/');
          }
        });
      }else{
        res.redirect('/login');
      }
    }
  });
});

// *** logout 처리 ***
router.get('/logout', function(req, res, next){
  req.session.destroy(function(err){
    if(err)
        console.log(`req.session.destroy error : ${err}`);
    res.redirect('/');
});
});

router.get('/changePwd', function(req, res, next){
  res.render('changePwd', {title: 'Change pwd', isOwner: auth.isOwner(req, res)})
})
// #endregion 




router.get('/about', function(req, res, next){
  res.render('about', { title: 'About', isOwner: auth.isOwner(req, res) });
});

router.get('/single', function(req, res, next){
  res.render('single', { title: 'Single', isOwner: auth.isOwner(req, res) });
})

router.get('/menu', function(req, res, next){
  res.render('menu', { title: 'Menu', isOwner: auth.isOwner(req, res) });
})

router.get('/contact', function(req, res, next){
  res.render('contact', { title: 'Contact Us', isOwner: auth.isOwner(req, res) });
})


module.exports = router;

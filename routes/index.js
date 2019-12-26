var express = require('express');
var router = express.Router();
var model = require('../models/DAO');
var auth = require('../lib/auth')

// 학생 index 페이지
router.get('/', function(req, res, next) {
  if(req.session.userId){
    if(req.session.userType === 'student'){
      res.redirect('/goout');
    }else if(req.session.userType === 'teacher'){
      res.redirect('/teacher')
    }else{
      res.redirect('/');
    }
  }else{
    console.log('req.session.userId 없음');
    model.selectStudentsData(function(results){
      res.render('index', { title: 'GSM 외출관리', isOwner: auth.isOwner(req, res)});
    });
  }
});

// #region 로그인 페이지 
router.get('/login', function(req, res, next){
  res.render('login', { title: 'Login', isOwner: auth.isOwner(req, res) });
});

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
      console.log(`로그인 데이터: ${results}`)
      if(formData.email === results.id && formData.password === results.pwd){
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

router.get('/logout', function(req, res, next){
  req.session.destroy(function(err){
    if(err)
        console.log(`req.session.destroy error : ${err}`);
    res.redirect('/');
});
});
// #endregion 

// // 외출 신청 페이지로 이동
// router.get('/requestGoOut', function(req, res, next){
//   res.render('goOutRequest', { title: 'Request go out', isOwner: auth.isOwner(req, res) })
// })

// // 외출 데이터 전송
// router.post('/requestGoOut', function(req, res, next){
//   values = [req.session.userId, req.body.startDay, `${req.body.startDay} ${req.body.startTime}`, `${req.body.endDay} ${req.body.endTime}`, req.body.place, req.body.reason, req.body.phoneNumber];
//   model.insertRequest(values, function(){
//     res.redirect('/')
//   })
// })

// // 체크박스로 선택한 외출 데이터 삭제 요청
// router.get('/delete/:serialNum', function(req, res, next){
//   model.deleteGoOutDataWithSerialNum(req.params.serialNum, function(){
//     res.redirect('/')
//   })
// })

// // 체크박스로 선택한 외출 데이터 수정 요청
// router.get('/update/:serialNum', function(req, res, next){
//   model.selectGoOutDataWithSerialNum(req.params.serialNum, function(results){
//     res.render('goOutUpdate', { title: 'Update go out', isOwner: auth.isOwner(req, res), results: results[0] })
//   })
// })

// // 수정된 form 데이터 전송 -> update 처리
// router.post('/updateGoOut', function(req, res, next){
//   dataObj = {
//     date: req.body.startDay,
//     leaveTime: `${req.body.startDay} ${req.body.startTime}`,
//     combackTime: `${req.body.endDay} ${req.body.endTime}`,
//     place: req.body.place,
//     reason: req.body.reason,
//     phoneNum: req.body.phoneNumber,
//     serialNum: req.body.serialNum,
//     id: req.session.userId
//   }
//   model.updateGoOutDataWithSerialNum(dataObj, function(){
//     res.redirect('/')
//   })
// })






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

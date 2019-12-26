var express = require('express');
var router = express.Router();
var model = require('../models/DAO');
var auth = require('../lib/auth')

// 학생 index 페이지
router.get('/', function(req, res, next) {
  //console.log(req.session);
  if(req.session.userId){
    model.selectGoOutDataWithUserId(req.session.userId, function(results){
      res.render('student/index', { title: 'GSM 외출관리', isOwner: auth.isOwner(req, res), dbData: results })
    });
  }else{
    res.redirect('/');
  }
});

// 외출 신청 페이지로 이동
router.get('/requestGoOut', function(req, res, next){
  res.render('student/goOutRequest', { title: 'Request go out', isOwner: auth.isOwner(req, res) })
})

// 외출 데이터 전송
router.post('/requestGoOut', function(req, res, next){
  values = [req.session.userId, req.session.userName, req.session.grade, req.session.class, req.body.startDay, `${req.body.startDay} ${req.body.startTime}`, `${req.body.endDay} ${req.body.endTime}`, req.body.place, req.body.reason, req.body.phoneNumber];
  model.insertRequest(values, function(){
    res.redirect('/goout')
  })
})

// 체크박스로 선택한 외출 데이터 수정 요청
router.get('/update/:serialNum', function(req, res, next){
  model.selectGoOutDataWithSerialNum(req.params.serialNum, function(results){
    res.render('student/goOutUpdate', { title: 'Update go out', isOwner: auth.isOwner(req, res), results: results[0] })
  })
})

// 수정된 form 데이터 전송 -> update 처리
router.post('/updateGoOut', function(req, res, next){
  dataObj = {
    date: req.body.startDay,
    leaveTime: `${req.body.startDay} ${req.body.startTime}`,
    combackTime: `${req.body.endDay} ${req.body.endTime}`,
    place: req.body.place,
    reason: req.body.reason,
    phoneNum: req.body.phoneNumber,
    serialNum: req.body.serialNum,
    id: req.session.userId
  }
  model.updateGoOutDataWithSerialNum(dataObj, function(){
    res.redirect('/goout')
  })
})

// 체크박스로 선택한 외출 데이터 삭제 요청
router.get('/delete/:serialNum', function(req, res, next){
  //res.send(`delete page : ${req.params.serialNum}`)
  model.deleteGoOutDataWithSerialNum(req.params.serialNum, function(){
    res.redirect('/goout')
  })
})


module.exports = router;

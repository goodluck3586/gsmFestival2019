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
  if(auth.isOwner(req, res).isLogin){
    values = [req.session.userId, req.session.userName, req.session.grade, req.session.class, req.body.startDay, `${req.body.startDay} ${req.body.startTime}`, `${req.body.endDay} ${req.body.endTime}`, req.body.place, req.body.reason, req.body.phoneNumber];
    model.insertRequest(values, function(){
      res.redirect('/goout')
    })
  }else{
    res.redirect('/')
  }
})

// 조회버튼 클릭
router.post('/search', function(req, res, next){
  console.log('req.session')
  for(var key in req.session)
    console.log(`key: ${key}, value: ${req.session[key]}`)
  console.log('req.body')
  for(var key in req.body)
    console.log(`key: ${key}, value: ${req.body[key]}`)

  if(req.session.userId && req.session.userType === 'student'){
    conditions = [];
    condition_date = "";
    if(req.body){
      // id 쿼리 조건 작성
      if(req.body.userName != "")
        conditions.push(`id='${req.session.userId}'`)

      // 검색 날짜 쿼리 작성
      if(req.body.startDay!="" && req.body.endDay!="")
        condition_date = `date>='${req.body.startDay}' and date<='${req.body.endDay}'`;
      else if(req.body.startDay!="" || req.body.endDay!=""){
        if (req.body.startDay!="")
          condition_date = `date>='${req.body.startDay}'`;
        else
          condition_date = `date<='${req.body.endDay}'`;
      }else{
        condition_date = `date>='2019-03-01' and date<='2019-12-31'`;
      }
      conditions.push(condition_date);
    }

    model.selectGoOutData(conditions, function(results){
      res.render('student/index', { title: 'GSM Teacher', isOwner: auth.isOwner(req, res), dbData: results })
    });
  }else{
    res.redirect('/');
  }
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

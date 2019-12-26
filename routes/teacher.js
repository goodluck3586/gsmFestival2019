var express = require('express');
var router = express.Router();
var model = require('../models/teacherDAO');
var auth = require('../lib/auth')

// 교사 index 페이지
router.get('/', function(req, res, next){
  console.log('req.body 데이터')
  for(var key in req.body)
    console.log(`key: ${key}, value: ${req.body[key]}`)
  if(req.session.userId && req.session.userType === 'teacher'){
      model.selectGoOutData(undefined, function(results){
        res.render('teacher/index', { title: 'GSM Teacher', isOwner: auth.isOwner(req, res), dbData: results })
      });
    }else{
      res.redirect('/');
    }
});

router.post('/search', function(req, res, next){
  console.log('req.session')
  for(var key in req.session)
    console.log(`key: ${key}, value: ${req.session[key]}`)
  console.log('req.body')
  for(var key in req.body)
    console.log(`key: ${key}, value: ${req.body[key]}`)

  if(req.session.userId && req.session.userType === 'teacher'){
    conditions = [];
    condition_date = "";
    if(req.body){
      // 학년 쿼리조건 작성
      if(req.body.grade != "")
        conditions.push(`grade=${req.body.grade}`)

      // 반 쿼리 조건 작성
      if(req.body.class != "")
        conditions.push(`class=${req.body.class}`)

      // 이름 쿼리 조건 작성
      if(req.body.userName != "")
        conditions.push(`name='${req.body.userName}'`)

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
      res.render('teacher/index', { title: 'GSM Teacher', isOwner: auth.isOwner(req, res), dbData: results })
    });
  }else{
    res.redirect('/');
  }
})

router.get('/allow/:serialNum', function(req, res, next){
  dataObj = {
    serialNum: req.params.serialNum,
    teacherId: req.session.userName,
    confirm: '승인됨'
  }
  model.allowGoOutDataWithSerialNum(dataObj, function(){
    res.redirect('/teacher')
  })
})

router.get('/refuse/:serialNum', function(req, res, next){
  dataObj = {
    serialNum: req.params.serialNum,
    teacherId: req.session.userName,
    confirm: '거부됨'
  }
  model.allowGoOutDataWithSerialNum(dataObj, function(){
    res.redirect('/teacher')
  })
})

// 체크박스로 선택한 외출 데이터 삭제 요청
router.get('/delete/:serialNum', function(req, res, next){
  model.deleteGoOutDataWithSerialNum(req.params.serialNum, function(){
    res.redirect('/teacher')
  })
})





















module.exports = router;
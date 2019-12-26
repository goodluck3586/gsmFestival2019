var mysql      = require('mysql');

// Mysql 연결 connection 객체 생성
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1111',
    database : 'gooutmanagement',
    dateStrings : true,
});

//#region ##########[msmber table]##########
// member 테이블 데이터 가져오기
exports.selectStudentsData = function(cb){
    sql = 'SELECT * FROM member';
    connection.query(sql, function (error, results, fields) {
      if(!error){
        cb(results);
      }else{
        console.log(error);
      }
    });
  }

exports.loginProcess = function(formData, cb){
    sql = 'SELECT * FROM member WHERE id = ?';
    connection.query(sql, [formData.email], function(err, results, fields){
        if(!err){
          console.log('loginProcess select data');
          console.log(results[0]);
          cb(results[0]);     // 검색된 row 하나만 리턴{id:, pwd:, name:, class:}
        }else{
          console.log('loginProcess 에러 발생');
          console.log(err.message);
        }
    })
}
//#endregion

// #region ##########[gooutmanagement table]##########

// SELECT(개인별 외출 현황 데이터)
exports.selectGoOutDataWithUserId = function(memberId, cb){
  sql = 'SELECT * FROM gooutmanagement WHERE id = ? ORDER BY `requestTime` DESC';
  connection.query(sql, [memberId], function (error, results, fields) {
    if(!error){
      cb(results);
    }else{
      console.log(error);
    }
  });
}

// SELECT(개인별 외출 현황 데이터)
exports.selectGoOutData = function(conditions, cb){
  var sql = "";

  if(conditions != undefined){
    if(conditions.length === 1){
      sql = `SELECT * FROM gooutmanagement WHERE ${conditions[0]} ORDER BY requestTime DESC`;
    }else{
      var str=""
      for(var i=0; i<conditions.length-1; i++){
        str += conditions[i]+' and '
      }
      str += conditions[conditions.length-1];
      sql = `SELECT * FROM gooutmanagement WHERE ${str} ORDER BY requestTime DESC`;
    }
  }else{
    sql = `SELECT * FROM gooutmanagement ORDER BY requestTime DESC`;
  }
  
    console.log(`완성된 sql문장: ${sql} `)
    connection.query(sql, function (error, results, fields) {
      if(!error){
        cb(results);
      }else{
        console.log(error);
      }
    });
  }

// 외출 요청 데이터를 DB에 추가하고 index.ejs로 redirect
exports.insertRequest = function(values, cb){
  // values = [`id`, `name`, `grade`, `class`, `date`, `startDay+startTime`, `endDay_endTime`, `place`, `reason`, `phoneNumber`];
  console.log(`insertRequest values : ${values}`);

  // confirm '신청중' 추가
  values.push('신청중');

  // requestTime 추가
  var date = new Date();
  date.setHours(date.getHours() + 9);
  console.log(`date.toISOString() : ${date.toISOString()}`);  // 2019-12-02T04:32:14.600Z
  values.push(date.toISOString().slice(0, 19).replace('T', ' ').toString());  // 2019-12-02T12:00 에서 T를 공백으로 교체함(Mysql과 같은 형식으로) -> 2019-12-02 04:32:14

  console.log(`INSERT DATA : ${values}`);     
  sql = 'INSERT INTO gooutmanagement (`id`, `name`, `grade`, `class`, `date`, `leaveTime`, `comebackTime`, `place`, `reason`, `phoneNum`, `confirm`, `requestTime`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, values, function(err, results, fields){
    if (err){
      console.log(err);
    }
    cb();
  });
}

// SELECT(선택된 외출 데이터)
exports.selectGoOutDataWithSerialNum = function(serialNum, cb){
  sql = 'SELECT * FROM `gooutmanagement` WHERE `serialNum` = ?';
  connection.query(sql, [serialNum], function(error, results, fields){
    if(!error){
      cb(results);
    }else{
      console.log(error);
    }
  })
}

// UPDATE (선택된 외출 데이터 수정)
exports.updateGoOutDataWithSerialNum = function(dataObj, cb){
  // requestTime 추가
  var date = new Date();
  date.setHours(date.getHours() + 9);
  dataObj.requestTime = date.toISOString().slice(0, 19).replace('T', ' ').toString();
  values = [dataObj.date, dataObj.leaveTime, dataObj.combackTime, dataObj.place, dataObj.reason, dataObj.phoneNum, dataObj.requestTime, dataObj.serialNum, dataObj.id];

  sql = 'UPDATE `gooutmanagement` SET date=?, leaveTime=?, comebackTime=?, place=?, reason=?, phoneNum=?, requestTime=? WHERE serialNum=? AND id=?';
  connection.query(sql, values, function(err, results, fields){
    if(!err){
      cb(results);
    }else{
      console.log(err);
    }
  })
}

// DELETE (선택된 외출 데이터 삭제)
exports.deleteGoOutDataWithSerialNum = function(serialNum, cb){
  sql = 'DELETE FROM `gooutmanagement` WHERE `serialNum` = ?';
  connection.query(sql, [serialNum], function(error, results, fields){
    if(!error){
      cb();
    }else{
      console.log(error);
    }
  })
}
//#endregion


















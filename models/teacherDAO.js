var mysql      = require('mysql');

// Mysql 연결 connection 객체 생성
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1111',
    database : 'gooutmanagement',
    dateStrings : true,
});

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

  exports.allowGoOutDataWithSerialNum = function(dataObj, cb){
    values = [dataObj.confirm, dataObj.teacherId, dataObj.serialNum];
    sql = 'UPDATE `gooutmanagement` SET confirm=?, teacherId=? WHERE serialNum=?';
    connection.query(sql, values, function(err, results, fields){
      if(!err){
        cb(results);
      }else{
        console.log(err);
      }
    })
  }

  exports.refuseGoOutDataWithSerialNum = function(dataObj, cb){
    values = [dataObj.confirm, dataObj.teacherId, dataObj.serialNum];
    sql = 'UPDATE `gooutmanagement` SET confirm=?, teacherId=? WHERE serialNum=?';
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
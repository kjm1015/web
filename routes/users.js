var express = require('express');
var router = express.Router();
const { getConnection } = require('../connect');
const oracledb = require('oracledb');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 로그인 페이지(get)
router.get('/login', function(req, res, next){
  res.render('index', { title: '로그인', pageName:'login.ejs'})
});

// 로그인 체크(post)
router.post('/login', async function(req, res){
  const scode = req.body.scode;
  const pass = req.body.pass;

  var con;

  try{
    con = await getConnection();

    var sql = "select * from students where scode=:scode";
    var result = await con.execute(sql, {scode}, {outFormat:oracledb.OUT_FORMAT_OBJECT});

    console.log(result.rows[0]);

    res.send(result.rows[0]);
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }finally{
    if(con) await con.close();
  }
});

module.exports = router;

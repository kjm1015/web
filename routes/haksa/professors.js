var express = require('express');
var router = express.Router();
const { getConnection } = require('../../connect');
const oracledb = require('oracledb');

// 학사관리의 교수 라우터
router.get('/', function(req, res, next){
    res.render('index', {title: '교수관리', pageName: 'haksa/professors.ejs'})
});

// 학사 관리 - 교수 리스트 라우터
router.get('/list.json', async function(req, res, next){    
    var con;
    try{
        con = await getConnection();
        const sql="select p.*, to_char(p.hiredate, 'YYYY-MM-DD') fdate, to_char(salary, '99,999,999') fsalary from professors p order by pcode desc";
        const result = await con.execute(sql, {}, {outFormat:oracledb.OUT_FORMAT_OBJECT});
        res.send(result.rows);
    }catch(err){

    }finally{
        if(con) await con.close();
    }
}); 

// 학사관리의 교수 등록 라우터(get)
router.get('/insert', async function(req, res, next){
    var con;
    var code;
    try {
        con = await getConnection();

        const sql = "select max(pcode)+1 newcode from professors";
        const result = await con.execute(sql);
        code = result.rows[0][0];
    }catch(err){

    }finally{
        if(con) await con.close();
    }
    res.render('index', {title: '교수등록', pageName: 'haksa/professors_insert', code})
});

// 학사관리의 교수 등록 라우터(post)
router.post('/insert', async function(req, res){
    const pcode = req.body.pcode;
    const pname = req.body.pname;
    const dept = req.body.dept;
    const title = req.body.title;
    const hiredate = req.body.hiredate;
    const salary = req.body.salary;

    console.log(pcode, pname, dept, title, hiredate, salary);

    var con;

    try{
        con = await getConnection();
        
        const sql = `insert into professors(pcode, pname, dept, hiredate, title, salary) values('${pcode}', '${pname}', '${dept}', '${hiredate}', '${title}', ${salary})`;
        
        await con.execute(sql, {}, {autoCommit:true});
        
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }finally{
        if(con) await con.close();
    }

});

// 학사관리의 교수 삭제 라우터(post)
router.post('/delete', async function (req, res) {
   const pcode = req.body.pcode;
   var con;
   
   try{
    con = await getConnection();
    const sql = 'delete from professors where pcode=:pcode';
    await con.execute(sql, {pcode}, {autoCommit:true});
    res.sendStatus(200);
   }catch(err){
    res.sendStatus(500)
   }finally{;
    if(con) await con.close();
   }
});

module.exports = router;
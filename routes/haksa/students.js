var express = require('express');
var router = express.Router();
const { getConnection } = require('../../connect');
const oracledb = require('oracledb');

// 학사관리의 학생 라우터
router.get('/', function(req, res, next){
    res.render('index', {title: '학생관리', pageName: 'haksa/students.ejs'})
});

// 학사관리의 학생 조회 라우터
router.get('/list.json', async function (req, res) {
    var con; 
   
    try{
        con = await getConnection();

        const sql = "select * from view_students order by dept";

        const result = await con.execute(sql, {}, {outFormat:oracledb.OUT_FORMAT_OBJECT});

        res.send(result.rows);
    }catch(err){
    
    }finally{
        if(con) await con.close();
    }
});

// 학사관리의 학생 등록 라우터(get)
router.get('/insert', async function(req, res){
    var con;
    var code;

    try{
        con = await getConnection();

        const sql = "select max(scode) + 1 from students";

        const result = await con.execute(sql);

        code = result.rows[0][0];
        console.log(code);
    }catch(err){

    }finally{
        if(con) await con.close(); 
    }
    
    res.render('index', {title: '학생입력', pageName: 'haksa/students_insert.ejs', code});
});

// 학사관리의 학생 등록 라우터(post)
router.post('/insert', async function (req, res) {
    const scode=req.body.scode;
    const sname=req.body.sname;
    const dept=req.body.dept;
    const birthday=req.body.birthday;
    const year=req.body.year;
    const pcode=req.body.pcode;

    console.log(scode, sname, dept, birthday, year, pcode);

    var con;

    try{
        con = await getConnection();

        sql = 
        "insert into students(scode, sname, dept, birthday, year, advisor)"
        +
        " values(:scode, :sname, :dept, to_date(:birthday, 'YYYY-MM-DD'), :year, :pcode)";

        console.log(sql);

        await con.execute(sql, {scode, sname, dept, birthday, year, pcode}, {autoCommit:true});

        res.sendStatus(200);
    }catch(err){

    }finally{
        if(con) await con.close();
    }
});

// 학사관리의 학생 삭제 라우터
router.post('/delete', async function (req, res) {
    var con;

    const scode = req.body.scode;

    try{
        con = await getConnection();

        const sql = `delete from students where scode=${scode}`;

        console.log(sql);

        await con.execute(sql, {}, {autoCommit:true});

        res.sendStatus(200);
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }finally{
        if(con) await con.close();
    }
})

module.exports = router;

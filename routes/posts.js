var express = require('express');
var router = express.Router();
const { getConnection } = require('../connect');
const oracledb = require('oracledb');

/* 게시글 목록 */
router.get('/', function (req, res, next) {
    res.render('index', { title: '게시글', pageName: 'posts/list.ejs' });
});

//글쓰기 페이지
router.get('/insert', function(req, res){
    res.render('index', {title:'글쓰기', pageName:'posts/insert.ejs'});
});

// 게시글 등록 (post)
router.post('/insert', async function(req, res) {
    const title=req.body.title;
    const content=req.body.content;
    const writer=req.body.writer;

    var con;

    try{
        con = await getConnection();

        var sql = "insert into posts(id, title, content, writer) values(post_id.nextval, :title, :content, :writer)";

        con.execute(sql, {title, content, writer}, {autoCommit:true});
        res.sendStatus(200);
    }catch(err){
        console.log(err);
    }finally{
        if(con) await con.close();
    }
});

// 게시글 삭제 
router.post('/delete', async function(req, res) {
    const id = req.body.id;

    var con;

    try{
        con = await getConnection();

        var sql = 'delete from posts where id=:id';

        await con.execute(sql, {id}, {autoCommit:true});

        res.sendStatus(200);
    }catch(err){
        console.log(err);
    }finally{
        if(con) await con.close();
    }
})

// 게시글 수정 페이지
router.get('/update/:id', async function(req, res) {
    const id = req.params.id;

    var con;

    try{
        con = await getConnection();

        var sql = 'select * from view_posts where id = :id';

        var result = await con.execute(sql, {id}, {outFormat:oracledb.OUT_FORMAT_OBJECT});

        var post = result.rows[0];

        res.render('index', {title: '글수정', pageName: 'posts/update.ejs', post});
    }catch(err){
        console.log(err);
    }finally{
        if(con) await con.close();
    }
});

// 게시글 수저
router.post('/update', async function(req, res){
    const id=req.body.id;
    const title=req.body.title;
    const content=req.body.content;
    console.log(id, title, content);
    try{
        con = await getConnection();
        let sql="update posts set title=:title, content=:content where id=:id";
        await con.execute(sql, {id, title, content}, {autoCommit:true});
        res.sendStatus(200);
    }catch(err){
        console.log('글수정', err.message);
    }
});


//게시글 목록 데이터 :/posts/list.json?page=1&size=5
router.get('/list.json', async function(req, res){
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 5;
    let word = req.query.word || '';
    let off_rows = (page-1) * size;
    let con;
    try{

        //게시글 데이터
        con = await getConnection();
        let sql = "SELECT * FROM VIEW_POSTS";
            sql +=` WHERE TITLE LIKE '%${word}%' OR CONTENT LIKE '%${word}%' OR  SNAME LIKE '%${word}%' `;
            sql +="  ORDER BY ID DESC";
            sql+=`   OFFSET ${off_rows} ROWS FETCH NEXT ${size} ROWS ONLY`;
        let result = await con.execute(sql, {}, {outFormat:oracledb.OUT_FORMAT_OBJECT});
        let list = result.rows;

        //게시글 데이터 총 개수
        sql = "select count(*) from view_posts";
        sql +=` WHERE TITLE LIKE '%${word}%' OR CONTENT LIKE '%${word}%' OR  SNAME LIKE '%${word}%' `;
        result = await con.execute(sql);
        let count =result.rows[0][0];
        res.send({list, count});
        
    }catch(err){
        console.log('게시글 목록 데이터', err.message);
    }finally{
        if(con) await con.close();
    }
})
module.exports = router;
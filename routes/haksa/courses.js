var express = require('express');
var router = express.Router();
const { getConnection } = require('../../connect');
const oracledb = require('oracledb');

// 학사관리의 강좌 라우터
router.get('/', function(req, res, next){
    res.render('index', {title: '강좌관리', pageName: 'haksa/courses.ejs'})
});

module.exports = router;

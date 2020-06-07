/**
 * 桌台相关路由
 */
const express = require('express');
const pool = require('../../pool');
const router = express.Router();
module.exports = router;
/**
 * API: GET /adimin/table
 * 含义：查询所有桌台的信息
 * 响应数据：
 * {code: 200, tableList: [..]}
 */
router.get('/',(req,res)=>{
	pool.query('SELECT tid,tname,type,status FROM xfn_table',(err,result)=>{
		if(err) throw err;
		res.send({code: 200, tableList: result});
	})
})


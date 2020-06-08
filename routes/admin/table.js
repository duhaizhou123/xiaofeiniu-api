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
	console.log(req.params.tid);
	pool.query('SELECT tid,tname,type,status FROM xfn_table',(err,result)=>{
		if(err) throw err;
		res.send({code: 200, tableList: result});
	})
})

/**
 * API GET /admin/table/reservation/:tid
 * 含义：获取预约状态桌台的详情
 * 响应数据：
 * {code: 200, reservationDetail:[{rid: xx, contackName: 'xx'},...]}
 * {code: 400, msg: 'table not exists'}
 */
router.get('/reservation/:tid',(req,res)=>{
	pool.query('SELECT rid,contactName,phone,contactTime,dinnerTime FROM xfn_reservation WHERE tableId=?',req.params.tid,(err,result)=>{
		if(err) throw err;
		if(result.length == 0){
			res.send({code: 400, msg: 'table not exists'});
		}else if(result.length>0){
			res.send({code: 200, reservationDetail: result})
		}
	})
})

/**
 * API GET /admin/table/inuse/:tid
 * 含义：获取占用桌台的详情
 * 响应数据：
 * {code: 200, inuseDetail:[{rid：xx, contactName: 'xx',..}],[]..}
 * {code: 400, msg: 'table not exists'}
 */
router.get('/inuse/:tid',(req,res)=>{
	pool.query('SELECT rid,contactName,phone,contactTime,dinnerTime FROM xfn_reservation WHERE tableId=?',req.params.tid,(err,result)=>{
		if(err) throw err;
		if(result.length == 0){
			res.send({code: 400, msg: 'table not exists'});
		} else if(result.length>0){
			res.send({code: 200, inuseDetail: result})
		}
	})
})


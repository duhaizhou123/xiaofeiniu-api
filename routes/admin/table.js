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

/**
 * API: PATCH /admin/table
 * 含义：修改桌台信息
 * 响应数据：
 * {code: 200, msg: 'modified table detail success'}
 * {code: 400,msg: 'modified table detail success, no modification'}
 */
router.patch('/',(req,res)=>{
	var data = req.body;
	pool.query('UPDATE xfn_table SET ? WHERE tid=?',[data,data.tid],(err,result)=>{
		if(err) throw err;
		if(result.changedRows == 0){
			res.send({code: 400,msg: 'modified table status success, no modification'});
		}else if(result.changedRows>0){
			res.send({code: 200, msg: 'modified table status success'});
		}
	})
})

/**
 * API: POST /admin/table
 * 含义：添加桌台
 * 请求参数：
 * {tname: 'xxx', type: 'xxx', status: x}
 * 响应参数：
 * {code: 200, msg: 'added table success, tid: xx'}
 * {code: 400,msg: 'added table fail, table name is already exists'}
 */
router.post('/',(req,res)=>{
	var data = req.body;
	pool.query('SELECT tid FROM xfn_table WHERE tname=?',data.tname,(err,result)=>{
		if(err) throw err;
		if(result.length>0){//如果桌名已经存在不能添加
			res.send({code: 400, msg: 'added table fail, table name is already exists'});
			return;
		}
	})
	//如果桌名不存在可以添加桌台
	pool.query('INSERT INTO xfn_table SET ?',data,(err,result)=>{
		if(err) throw err;
		res.send({code: 200, msg: 'added table success', tid: result.insertId});
	})
})

/**
 * API: DELETE /admin/table/:tid
 * 含义：删除桌台
 * 响应参数：
 * {code: 200, msg: '1 table delete'}
 * {code: 400, msg: '0 table delete'}
 */
router.delete('/:tid',(req,res)=>{
	pool.query('UPDATE xfn_order SET tableId=NULL WHERE tableId=?',req.params.tid,(err,result)=>{
		if(err) throw err;
		pool.query('UPDATE xfn_reservation SET tableId=NULL WHERE tableId=?',req.params.tid,(err,resutl)=>{
			if(err) throw err;
			pool.query('DELETE FROM xfn_table WHERE tid=?',req.params.tid,(err,result)=>{console.log(result);
				if(err) throw err;
				if(result.affectedRows > 0){
					res.send({code: 200, msg: '1 table delete'});
				}else if(result.affectedRows == 0){
					res.send({code: 400, msg: '0 table delete'});
				}
				
			})
		})
		
	})	
})


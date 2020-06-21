/*
 * 全局设置相关路由
 */
const express = require('express');
const pool = require('../../pool');
const router = express.Router();
module.exports = router;

/*
*API: GET /admin/setting
*含义：查询全局设置
*响应数据：
* {code:200, settings:{sid: 'x',appName: 'xxx', apiUrl: 'xxx'....}}
*/
router.get('/',(req,res)=>{
	pool.query('SELECT sid,appName,apiUrl,adminUrl,appUrl,icp,copyright FROM xfn_settings',(err,result)=>{
		if(err) throw err;
		res.send({code: 200, settings:result[0]});
	})
})

/*
*API: PUT /admin/setting
*请求数据：{appName: 'xxx',apiUrl: 'xxx',..}
*含义：修改全局设置
*响应数据：
*{code: 200, msg: 'modified global settings seccuss'}
*{code: 400, msg: 'modified global settings seccuss, no modification'}
*/
router.put('/',(req,res)=>{
	var data = req.body;
	pool.query('UPDATE xfn_settings SET ?',data,(err,result)=>{
		if(err) throw err;
		if(result.changedRows>0){//新值和旧值不一样
			res.send({code: 200, msg: 'modified global settings seccuss'});
		} else {//新值和旧值一样
			res.send({code: 400, msg: 'modified global settings seccuss, no modification'});
		}
	})
})

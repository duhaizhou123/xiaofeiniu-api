/*
 * 管理员相关的路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/*
*API: POST /admin/login
*请求数据：{aname: 'xxx', apwd: 'xxx'}
*完成用户登录验证
*返回数据：
* {code: 200, msg: 'login success'}
* {code: 400, msg: 'aname or apwd err'}
*/
router.post('/login',(req,res)=>{
	var aname = req.body.aname;
	var apwd = req.body.apwd;
	//需要对用户输入的密码执行加密函数
	pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)',[aname,apwd],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send({code: 200, msg: 'login success'});
		} else {
			res.send({code: 400, msg: 'aname or apwd err'});
		}		
	})
})
/*
*API: PATCH /admin
*请求数据：{aname: 'xxx', apwd: 'xxx', oldPwd: 'xxx', newPwd}
*根据管理员名和密码修改管理员密码
*返回数据：
* {code: 200, msg: 'modified success'}
* {code: 400, msg: 'aname or apwd err'}
* {code: 401, msg: 'apwd not modified'}
*/


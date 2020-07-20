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
*含义：完成用户登录验证
*响应数据：
* {code: 200, msg: 'login success'}
* {code: 400, msg: 'aname or apwd err'}
*/
router.post('/login', (req, res) => {
	//需要对用户输入的密码执行加密函数
	var data = req.body;
	pool.query('SELECT aname,role FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)', [data.aname, data.apwd], (err, result) => {
		if (err) throw err;
		if (result.length > 0){
			req.session.user = result[0];
			res.send({ code: 200, msg: 'login success', user: result[0]});
		} else {
			res.send({ code: 400, msg: 'aname or apwd err' });
		}
	})
})
/*
*API: PATCH /admin
*请求数据：{aname: 'xxx', apwd: 'xxx', oldPwd: 'xxx', newPwd}
*含义：根据管理员名和密码修改管理员密码
*响应数据：
* {code: 200, msg: 'modified success'}
* {code: 400, msg: 'aname or apwd err'}
* {code: 401, msg: 'apwd not modified'}
*/
router.patch('/', (req, res) => {
	//查询该用户是否存在
	pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)', [req.body.aname, req.body.oldPwd], (err, result) => {
		if (err) throw err;
		//用户不存在
		if (result.length == 0) {
			res.send({ code: 400, msg: 'aname or apwd err' });
			return;
		}
		//用户存在修改其密码
		pool.query('UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?', [req.body.newPwd, req.body.aname], (err, result) => {
			if (err) throw err;
			//新旧密码不一样
			if (result.changedRows > 0) {
				res.send({ code: 200, msg: 'modified success' });
			} else {//新旧密码一样
				res.send({ code: 401, msg: 'apwd not modified' });
			}
		})

	})

})

/**
 * API : POST /admin/loginInfo
 * 含义：保存用户登录信息
 * 请求数据：{adminName: 'xx', loginTime: 'xx'}
 * 响应数据：
 * {code: 200, message: 'recording login info success'};
 * {code: 400, message: 'recording login info fail'};
 * 
 */
router.post('/loginInfo',(req,res)=>{
	var data = req.body;
	pool.query('INSERT INTO xfn_login_info SET ?',data,(err,result)=>{
		if(err) throw err;
		if(result.changedRows>0){
			res.send({code: 200, message: 'recording login info success'});
		}else{
			res.send({code: 400, message: 'recording login info fail'});
		}
	})
})

/**
 * API: GET /admin/loginOut
 * 含义：退出登录
 * 返回数据：{code: 200, msg: 'login out suceess'}
 */

 router.get('/loginOut',(req,res)=>{console.log(req.session);
	 if(req.session.user){
		 req.session.user = null;
		 res.send({code: 200, msg: 'login out success'});
	 }
 })


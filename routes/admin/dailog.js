/*
 * 聊天相关的路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/*
*API: POST /admin/dailog/drafts
*请求数据：{word: 'xxx', adminName: 'xxx', inputTime: 'xx'}
*含义：记录用户输入信息
*响应数据：
* {code: 200, msg: 'input sth success'}
* {code: 400, msg: 'input sth fail'}
*/
router.post('/drafts', (req, res) => {
	var data = req.body;
	pool.query('INSERT INTO xfn_drafts SET ?', data, (err, result) => {
		if (err) throw err;
		if (result.affectedRows > 0) {
			res.send({ code: 200, msg: 'input sth success' });
		} else {
			res.send({ code: 400, msg: 'input sth fail' });
		}
	})
})

/*
*API: POST /admin/dailog/message
*请求数据：{message: 'xxx', adminName: 'xxx', sendTime: 'xx'}
*含义：记录用户输入信息
*响应数据：
* {code: 200, msg: 'send message success'}
* {code: 400, msg: 'send message fail'}
*/
router.post('/message', (req, res) => {
	var data = req.body;
	pool.query('INSERT INTO xfn_message SET ? ', data, (err, result) => {
		if (err) throw err;
		if (result.affectedRows > 0) {
			res.send({ code: 200, msg: 'send message success' });
		} else {
			res.send({ code: 400, msg: 'send message fail' });
		}
	})
})


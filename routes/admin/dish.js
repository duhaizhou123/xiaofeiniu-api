/*
 * 菜品相关的路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/*
*API: GET /admin/dish
*含义：查询所有菜品
*返回值形如：
* {[cid: 1, cname: '肉类', dishList:[..]],
*  [cid: 2, cname: '蔬菜', dishList:[..]],
*	 ...
* }
*/
router.get('/', (req, res) => {
	//查询所有菜品类别
	pool.query('SELECT cid,cname FROM xfn_category', (err, result) => {
		if (err) throw err;
		var categoryList = result;
		var count = 0
		for (let item of categoryList) {
			pool.query('SELECT did,title,imgUrl,price,detail FROM xfn_dish WHERE categoryId=?', item.cid, (err, result) => {
				if (err) throw err;
				item.dishList = result;
				count++;
				if (count == categoryList.length){
					res.send(categoryList);
				}
			})
		}
	})
})

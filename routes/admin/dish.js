/*
 * 菜品相关的路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
var temFile = '';
var newFile = '';
module.exports = router;

/*
*API: GET /admin/dish
*含义：查询所有菜品
*响应数据：
* [{cid: 1, cname: '肉类', dishList:[..]},
*  {cid: 2, cname: '蔬菜', dishList:[..]},
*	 ...
* ]
*/
router.get('/', (req, res) => {
	//查询所有菜品类别
	pool.query('SELECT cid,cname FROM xfn_category', (err, result) => {
		if (err) throw err;
		var categoryList = result; //类别列表
		var count = 0;
		//循环遍历每个菜品类别，查询该类别下有那些菜品
		for (let item of categoryList) {
			pool.query('SELECT did,title,imgUrl,price,detail FROM xfn_dish WHERE categoryId=? ORDER BY did DESC', item.cid, (err, result) => {
				if (err) throw err;
				item.dishList = result;
				count++;
				if (count == categoryList.length){//所有类别下的菜品都查询完成后发送响应消息
					res.send(categoryList);
				}
			})
		}
	})
})

/**
 * API: POST /admin/dish/image
 * 含义：将客户端上传的菜品图片，保存在服务器临时目录下，返回该图片在服务器上的随机文件名
 * 响应数据：
 * {code: 200, msg: 'upload image success',fileName:'xxx'}
 */
//引入multer中间件
const multer = require('multer');
//引入fs中间件
const fs = require('fs');
//指定客户端上传的文件临时存储路径
var upload = multer({
	dest: 'public/tem/'	
});

router.post('/image', upload.single('dishImg'),(req,res)=>{
	temFile = req.file.path;
	//原始文件名的后缀
	var suffix = req.file.originalname.slice(req.file.originalname.lastIndexOf('.')); 
	newFile = randFileName(suffix); //新文件名
	//向客户端发送上传图片成功的响应消息
	res.send({code: 200, msg: 'upload success', fileName: newFile});

	//设置定时任务删除保存在临时目录下的图片
	setTimeout(() => {
    deleteFolder('public/tem')
  }, 3600000);
	
	/**
	 * 生成一个随机文件名方法
	 * suffix: 文件后缀名
	 */
	
	function randFileName(suffix){
		//生成一个时间戳
		var dateTime = new Date().getTime();
		//生成一个4位随机数
		var randNum = Math.floor(Math.random()*(10000-1000)+1000);
		return dateTime+randNum+suffix;
	}

	/**
	 * 删除文件夹下所有文件方法
	 * path： 文件夹路径
	 */ 
	function deleteFolder(path) {
		var files = [];
		if (fs.existsSync(path)) {
			if (fs.statSync(path).isDirectory()) {
				files = fs.readdirSync(path);
				files.forEach(function (file, index) {
					var curPath = path + "/" + file;
					if (fs.statSync(curPath).isDirectory()) {
						deleteFolder(curPath);
					} else {
						fs.unlinkSync(curPath);
					}
				});  
    	}
  	}
	}
});

/**
 * API: POST /admin/dish
 * 含义：添加一个新的菜品
 * 请求数据：{title: 'xxx', imgUrl: 'xxx', price: xx.xx, detail: 'xxx', categoryId: 1}
 * 响应数据：
 * {code: 200, msg: 'added dish success', did: xx},
 * {code: 400,msg: 'dish is already exists'}
 */
router.post('/',(req,res)=>{
	var data = req.body;
	pool.query('SELECT did FROM xfn_dish WHERE title=?',data.title,(err,result)=>{
		if(err) throw err;
		if(result.length > 0){
			res.send({code: 400, msg: 'dish is already exists'});
		}else{
			pool.query('INSERT INTO xfn_dish SET ?',data,(err,result)=>{
				if(err) throw err;
				//数据库添加菜品成功，将菜品图片移动至永久目录
				fs.rename(temFile, 'public/img/dish/'+newFile,()=>{
					//返回添加菜品成功的响应消息
					res.send({code: 200, msg: 'added dish success', did: result.insertId});
				});
				
			})
		}
	})
	
})

/**
 * API: GET /admin/dish/:did
 * 含义：查看某一个菜品详情
 * 响应数据：
 * {code: 200, dishDetail:[..]}
 * {code: 400, msg:'dish not exists'}
 * 
 */
router.get('/:did',(req,res)=>{
	pool.query('SELECT title,imgUrl,price,detail,categoryId FROM xfn_dish WHERE did=?',req.params.did,(err,result)=>{
		if(err) throw err;
		if(result.length == 0){
			res.send({code: 400, msg:'dish not exists'});
		} else {
			res.send({code: 200, dishDetail:result[0]})
		} 
		
	})
})

/**
 * API: PUT /admin/dish
 * 含义：修改某一个菜品
 * 请求参数：
 * {did: xx, title: 'dd', imgUrl: 'xx.jpg', price: cc,detail: 'xx', categoryId: xx }
 * 响应数据：
 * {code: 200, msg: 'dish modified success'}
 * {code: 400, msg:'dish not exists'}
 * 
 */
router.put('/',(req,res)=>{
	var data = req.body;
	pool.query('UPDATE xfn_dish SET? WHERE did=?',[data,data.did],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows == 0){
			res.send({code: 400, msg: 'dish not exists'});
		} else if(result.affectedRows == 1 && result.changedRows == 0){
			res.send({code: 401, msg: '0 dish modified success, no modification'})
		}else{
			res.send({code: 200, msg: '1 dish modified success'})
		} 
		
	})
})

/**
 * API: DELETE /admin/dish/:did
 * 含义：删除某一个菜品
 * 响应数据：
 * {code: 200, msg: 'dish deleted success'}
 * {code: 400, msg:'dish not exists'}
 * 
 */
router.delete('/:did',(req,res)=>{
	pool.query('UPDATE xfn_order_detail SET dishId=NULL WHERE dishId=?',req.params.did,(err,result)=>{
		if(err) throw err;
	})
	pool.query('DELETE FROM xfn_dish  WHERE did=?',req.params.did,(err,result)=>{
		if(err) throw err;
		if(result.affectedRows == 0){
			res.send({code: 400, msg: 'dish not exists'});
		} else {
			res.send({code: 200, msg: 'dish deleted success'})
		} 
		
	})
})


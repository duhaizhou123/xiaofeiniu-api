/*
 * 小肥牛扫码点餐项目API子系统
 */

const PORT = 8090;
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const categoryRouter = require('./routes/admin/category');
const adminRouter = require('./routes/admin/admin');
const dishRouter = require('./routes/admin/dish');
const settingRouter = require('./routes/admin/setting');
const tableRouter = require('./routes/admin/table');
const dailogRouter = require('./routes/admin/dailog');

//创建HTTP应用服务器
var app = express();
app.listen(PORT,()=>{
	console.log('Server Listening: '+PORT );
});



//使用中间件
app.all('*', function(req, res, next) {
  var requestOrigin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", requestOrigin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  secret: 'xfn',   //配置加密字符串,它会在原有的加密基础上和这个字符串拼起来去加密,目的就是增加安全性,防止客户端恶意伪造session
  name: 'cookie_name',		//cookie的名称  也是cookie的key
  cookie: {maxAge: 1000*60*60 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: false  //true  不管你是否使用session存数据  ,都默认分配给客户端一个session
}));


//挂载路由器
app.use('/admin/category',categoryRouter);
app.use('/admin',adminRouter);
app.use('/admin/dish',dishRouter);
app.use('/admin/setting',settingRouter);
app.use('/admin/table',tableRouter);
app.use('/admin/dailog',dailogRouter);

// const ws = new WebSocket('ws://127.0.0.1:8090/admin/dailog');

//  ws.on('open', function open() {
// 	 ws.send('something');
// 	 });

// ws.on('message', function incoming(data) {
//   console.log(data);
// });



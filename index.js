/*
 * 小肥牛扫码点餐项目API子系统
 */

const PORT = 8090;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
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
app.use(cors({
	origin: '*'
}));
app.use(bodyParser.json());

//挂载路由器
app.use('/admin/category',categoryRouter);
app.use('/admin',adminRouter);
app.use('/admin/dish',dishRouter);
app.use('/admin/setting',settingRouter);
app.use('/admin/table',tableRouter);
app.use('/admin/dailog',dailogRouter);

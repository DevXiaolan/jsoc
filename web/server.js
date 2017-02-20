/**
 * Created by lanhao on 15/5/17.
 */

//引入配置文件
const config = require('./config/config');
const colors = require('colors');
const fs = require('fs');

if(process.mock){
  if(!fs.existsSync(process.mock))
  config.apis = process.mock;
}

console.log('Mock in '+colors.green(config.apis));

//引入小蓝框架
var xiaolan = require('./xiaolan')(config);

//启动监听服务
xiaolan.createServer();

console.log('URL : '+colors.yellow('http://127.0.0.1:'+config.port));

/**
 * Created by lanhao on 15/5/17.
 */

//引入配置文件
const config = require('./config/config');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const EOL = require('os').EOL;

if(process.mock){
  if(!fs.existsSync(process.mock)){
    config.apis = __dirname+'/../plans/'+process.mock;

  }else{
    config.apis = process.mock;
  }
}

config.apis = path.resolve(config.apis);

if(!fs.existsSync(config.apis)){
  console.log(EOL.repeat(2) + colors.red('"'+config.apis+'" Not Found') + EOL.repeat(2));
  process.exit(-1);
}


console.log('Mock with '+colors.green(config.apis));

//引入小蓝框架
var xiaolan = require('./xiaolan')(config);

//启动监听服务
xiaolan.createServer();

console.log('URL : '+colors.yellow('http://127.0.0.1:'+config.port));

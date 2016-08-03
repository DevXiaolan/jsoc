/**
 * Created by lanhao on 16/8/3.
 */

'use strict';
const fs = require('fs');
const os = require('os');
const EOL = (os && os.EOL)?os.EOL:'\n';
const makeData = require('./makeData.js');

let obj2md = {};

obj2md.make = function (plan) {
  let obj = null;
  try{
    obj = require(__dirname+'/../../plans/'+plan+'.js');
  }catch(ex){
    
  }

  if(obj) {
    let content = '';
    content += '## 接口文档 [' + plan + '] ' + EOL;
    content += '### 接口地址:' + EOL + EOL;
    let date = new Date();
    content += '### 生成日期:' + (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()) + EOL + EOL;
    content += '    ' + obj.host + EOL + EOL;

    for (let k in obj.apis) {
      content += '***' + EOL+ EOL;
      content += '## ' + obj.apis[k].name + EOL;
      content += '**请求路径**:   ' + EOL + '>' + obj.apis[k].request.method.toUpperCase() + '   ' + obj.apis[k].request.uri + EOL + EOL;
      content += object2md(obj.apis[k].request.params, 'URL占位参数');
      content += object2md(obj.apis[k].request.headers, '请求头部');
      content += object2md(obj.apis[k].request.query, 'QueryString');
      content += object2md(obj.apis[k].request.body, 'Body');
      content += '**返回示例**:' + EOL + EOL;
      content += '    ' + prettyJson2(response(obj.apis[k].response.body), 1).replace(/},/g, '}') + EOL;
    }
    return content;
  }else{
    return false;
  }
};

let prettyJson2 =  (obj, tabCount) => {
  if(!tabCount)tabCount = 0;

  var EOL = (os && os.EOL)?os.EOL:'\n';
  tabCount++;
  if (typeof obj == 'object' && obj!==null) {
    var r = '';
    var isArray = Array.isArray(obj);
    r += (isArray) ? '['+EOL : '{'+EOL;
    var keys = Object.keys(obj);
    var k ;
    while(k=keys.shift()){
      if(isArray){
        r += '  '+'  '.repeat(tabCount) + prettyJson2(obj[k], tabCount);
      }else{
        r += '  '+'  '.repeat(tabCount) + k + ' : ' + prettyJson2(obj[k], tabCount);
      }
      if(keys.length == 0){
        r = r.substr(0,r.length-2)+EOL;
      }
    }

    return r += '  '+'  '.repeat(tabCount - 1) + ((isArray) ? '],' : '},') + EOL;
  } else {
    return (Number.isNaN(obj*1)?'\''+ obj +'\'':obj) +','+EOL;
  }
};

let object2md =  (obj,title) => {
  var content = '';
  content += '**'+title+'**:   '+EOL+EOL;

  if(obj && Object.keys(obj).length>0){
    content += '<table style="width: 90%;text-align: center;">' + EOL + '<thead>' + EOL + '<tr><th>参数名</th><th>类型</th><th>描述</th><th>必填</th>' + EOL + '</tr></thead>' + EOL + '<tbody>' + EOL;
    content += entity2tr(obj);
    content += EOL + '</tbody>' + EOL + '</table>' + EOL;
  }else {
    content += '<p>（无）</p>' + EOL;
  }
  return content+EOL;
};

let entity2tr = (obj,prefix) => {
  var content = '';
  prefix = prefix?prefix+'.':'';
  for(let i in obj){
    if(obj[i]._type || obj[i]._length || obj[i]._assert) {
      content += '<tr><td>' + prefix + i + '</td><td>' + obj[i]._type + '</td><td>' + (obj[i]._desc ? obj[i]._desc : '') + '</td><td>' + (obj[i]._required ? 'Yes' : 'No') + '</td></tr>' + EOL;
    }else{
      content += entity2tr(obj[i],i);
    }
  }
  return content;
};

let response = (retData) => {
  var result = {};
  if(retData){
    if(typeof retData == 'object' && !(retData._type) && !(retData._assert!==undefined)){
      for(let k in retData){
        result[k] = response(retData[k]);
      }
    }else{
      result = makeData(retData);
    }
  }else{
    return {};
  }
  return result;
};

module.exports = obj2md;


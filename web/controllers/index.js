/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
var fs = require('fs');
var os = require('os');
var EOL = (os && os.EOL)?os.EOL:'\n';
var async = require('async');
var makeData = require('../../libs/func/makeData.js');
var config = require('../config/config.js');
var Controller = {};

Controller.plansCache = {};

Controller.index = function (req,res) {
    res.html('index.html');
};

!function(){
    var files = fs.readdirSync(process.cwd()+'/../apiDocs');
    async.each(files, function (it, cb) {
        delete require.cache[require.resolve(process.cwd()+'/../apiDocs/'+it)];
        var _tmp = require(process.cwd()+'/../apiDocs/'+it);
        Controller.plansCache[_tmp.name?_tmp.name:it.split('.')[0]] = _tmp;
        cb(null,null);
    }, function (err, ret) {
        if(!err){
            console.log('load plans success');
        }
    });
}();

Controller.plans = function(req,res){
    res.json(200,Object.keys(Controller.plansCache));
};

Controller.savePlan = function(req,res){
    try{
        var plan = JSON.parse(req.body.plan);
    }catch(ex){
        var plan = false;
    }
    var planName = req.body.name;
    if(!!plan){
        var content = '\'use strict\';'+os.EOL;
        content += 'module.exports = ';
        content += prettyJson(plan,4);
        fs.writeFileSync(process.cwd()+'/../apiDocs/'+planName+'.js',content+';'+os.EOL);
        res.json(400,{},'good request');
    }else{
        res.json(400,{},'bad request');
    }
};

Controller.detail = function(req,res){
    var plan = req.query.plan;
    config.apis = plan;
    if(Controller.plansCache[plan]){
        res.json(200,Controller.plansCache[plan]);
    }else{
        console.log(Controller.plansCache);
        res.json(404,{},'plan not found');
    }
};

Controller.docs = function(req,res){
    var plan = Controller.plansCache[req.params[2]];
    if(plan){
        res.setHeader("Content-Disposition", "attachment;filename="+req.params[2]+'.md');
        res.setHeader('Content-type', 'application/octet-stream');

        let content = '';
        content += '## 接口文档 ['+req.params[2]+'] '+EOL;
        content += '### 接口地址:'+EOL+EOL;
        content += '    '+plan.host+EOL+EOL;

        for(let k in plan.apis){
            content += '***'+EOL;
            content += '### '+plan.apis[k].name+EOL;
            content += '**请求路径**:   '+EOL+'>'+plan.apis[k].method.toUpperCase()+'   '+plan.apis[k].uri+EOL+EOL;
            content += object2md(plan.apis[k].header,'请求头部');
            content += object2md(plan.apis[k].query,'QueryString');
            content += object2md(plan.apis[k].body,'Body');
            content += '**返回示例**:'+EOL+EOL;
            content += '    '+prettyJson2(response(plan.apis[k].return),1)+EOL;

        }
        res.end(content);
    }else{
        res.json(404,{},'plan not found');
    }
};

var prettyJson = function (obj, tabCount) {
    return JSON.stringify(obj,null,tabCount);
};
var prettyJson2 = function (obj, tabCount) {
    if(!tabCount)tabCount = 0;

    var EOL = (os && os.EOL)?os.EOL:'\n';
    tabCount++;
    if (typeof obj == 'object') {
        var r = '';
        var isArray = Array.isArray(obj);
        r += (isArray) ? '['+EOL : '{'+EOL;
        var keys = Object.keys(obj);
        var k = null;
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
}

var object2md = function (obj,title) {
    var content = '';
    content += '**'+title+'**:   '+EOL+EOL;
    content += '| 参数名        | 参数值           | 长度       | 必填  | '+EOL+'|:-------------:|:-------------:|:-------------:|:-------------:|'+EOL;
    for(let i in obj){
        content += '| '+i+'  | '+obj[i]._type+'      | '+obj[i]._length+'       | '+(obj[i]._required?'Yes':'No')+'  | '+EOL;
    }
    return content+EOL;
}

var response = function(retData){
    var result = {};
    if(retData){
        if(typeof retData == 'object' && !((retData._type) || (retData._assert))){
            for(let k in retData){
                result[k] = response(retData[k]);
            }
        }else{
            result = makeData(retData._assert?retData._assert:retData._type,retData._length);
        }
    }else{
        return {};
    }
    return result;
};

module.exports = Controller;

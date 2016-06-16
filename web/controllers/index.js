/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const EOL = (os && os.EOL)?os.EOL:'\n';
const async = require('async');
const makeData = require('../../libs/func/makeData.js');
const config = require('../config/config.js');
const Controller = {};

Controller.plansCache = {};

Controller.index =  (req,res) => {
    res.html('index.html');
};
let loadPlan = () =>{
    var files = fs.readdirSync(process.cwd()+'/../plans');
    async.each(files,  (it, cb) => {
        delete require.cache[require.resolve(process.cwd()+'/../plans/'+it)];
        let _tmp = require(process.cwd()+'/../plans/'+it);
        Controller.plansCache[_tmp.name?_tmp.name:it.split('.')[0]] = _tmp;
        cb(null,null);
    },  (err, ret) => {
        if(!err){
            console.log('load plans success',ret);
        }
    });
};
loadPlan();

Controller.plans = (req,res) => {
    res.json(200,Object.keys(Controller.plansCache));
};

Controller.savePlan = (req,res) => {
    var plan = false;
    try{
        plan = JSON.parse(decodeURIComponent(req.body.plan));
    }catch(ex){
    }
    var planName = decodeURIComponent(req.body.name);

    if(!!plan){
        var content = '\'use strict\';'+os.EOL;
        content += 'module.exports = ';
        content += prettyJson(plan,4);
        fs.writeFileSync(process.cwd()+'/../plans/'+planName+'.js',content+';'+os.EOL);
        loadPlan();
        res.json(200,{},'good request');
    }else{
        res.json(400,{},'bad request');
    }
};

Controller.detail = (req,res) => {
    var plan = req.query.plan;
    config.apis = plan;
    if(Controller.plansCache[plan]){
        res.json(200,Controller.plansCache[plan]);
    }else{
        console.log(Controller.plansCache);
        res.json(404,{},'plan not found');
    }
};

Controller.docs = (req,res) => {
    var plan = Controller.plansCache[req.params[2]];
    var type = req.query.type;
    if(plan){
        if(type!='json') {
            res.setHeader("Content-Disposition", "attachment;filename="+req.params[2]+'.md');
            res.setHeader('Content-type', 'application/octet-stream');
        }
        let content = '';
        content += '## 接口文档 ['+req.params[2]+'] '+EOL;
        content += '### 接口地址:'+EOL+EOL;
        let date = new Date();
        content += '### 生成日期:'+(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate())+EOL+EOL;
        content += '    '+plan.host+EOL+EOL;

        for(let k in plan.apis){
            content += '***' + EOL;
            content += '## ' + plan.apis[k].name + EOL;
            content += '**请求路径**:   ' + EOL + '>' + plan.apis[k].request.method.toUpperCase() + '   ' + plan.apis[k].request.uri + EOL + EOL;
            content += object2md(plan.apis[k].request.params, 'URL占位参数');
            content += object2md(plan.apis[k].request.headers, '请求头部');
            content += object2md(plan.apis[k].request.query, 'QueryString');
            content += object2md(plan.apis[k].request.body, 'Body');
            content += '**返回示例**:' + EOL + EOL;
            content += '    ' + prettyJson2(response(plan.apis[k].response.body), 1).replace(/},/g,'}') + EOL;
        }
        res.end(content);
    }else{
        res.json(404,{},'plan not found');
    }
};

var prettyJson =  (obj, tabCount) => {
    return JSON.stringify(obj,null,tabCount);
};
var prettyJson2 =  (obj, tabCount) => {
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

var object2md =  (obj,title) => {

    var content = '';
    content += '**'+title+'**:   '+EOL+EOL;

    if(obj && Object.keys(obj).length>0){
        content += '<table style="width: 90%;text-align: center;">' + EOL + '<thead>' + EOL + '<tr><th>参数名</th><th>参数值</th><th>最大长度</th><th>必填</th>' + EOL + '</tr></thead>' + EOL + '<tbody>' + EOL;
        content += entity2tr(obj);
        content += EOL + '</tbody>' + EOL + '</table>' + EOL;
    }else {
        content += '<p>（无）</p>' + EOL;
    }
    return content+EOL;
};

var entity2tr = (obj,prefix) => {
    var content = '';
    prefix = prefix?prefix+'.':'';
    for(let i in obj){
        if(obj[i]._type || obj[i]._length || obj[i]._assert) {
            content += '<tr><td>' + prefix + i + '</td><td>' + obj[i]._type + '</td><td>' + (obj[i]._length ? obj[i]._length : '') + '</td><td>' + (obj[i]._required ? 'Yes' : 'No') + '</td></tr>' + EOL;
        }else{
            content += entity2tr(obj[i],i);
        }
    }
    return content;
};

var response = (retData) => {
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

module.exports = Controller;

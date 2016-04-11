/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
var fs = require('fs');
var os = require('os');
var async = require('async');
var Controller = {};

Controller.plansCache = {};

Controller.index = function (req,res) {
    res.html('index.html');
};

Controller.plans = function(req,res){
    var files = fs.readdirSync(process.cwd()+'/../apiDocs');
    async.each(files, function (it, cb) {
        delete require.cache[require.resolve(process.cwd()+'/../apiDocs/'+it)];
        var _tmp = require(process.cwd()+'/../apiDocs/'+it);
        Controller.plansCache[_tmp.name?_tmp.name:it.split('.')[0]] = _tmp;
        cb(null,null);
    }, function (err, ret) {

        res.json(200,Object.keys(Controller.plansCache));
    });
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
        content += prettyJson(plan,0);
        fs.writeFileSync(process.cwd()+'/../apiDocs/'+planName+'.js',content.substr(0,content.length-2)+';'+os.EOL);
        res.json(400,{},'good request');
    }else{
        res.json(400,{},'bad request');
    }
};

Controller.detail = function(req,res){
    var plan = req.query.plan;
    if(Controller.plansCache[plan]){
        res.json(200,Controller.plansCache[plan]);
    }else{
        res.json(404,{},'plan not found');
    }
};

var prettyJson = function (obj, tabCount) {
    tabCount++;
    if (typeof obj == 'object') {
        var r = '';
        var isArray = Array.isArray(obj);
        r += (isArray) ? '['+os.EOL : '{'+os.EOL;
        var keys = Object.keys(obj);
        var k = null;
        while(k=keys.shift()){
            if(isArray){
                r += '    '.repeat(tabCount) + prettyJson(obj[k], tabCount);
            }else{
                r += '    '.repeat(tabCount) + k + ' : ' + prettyJson(obj[k], tabCount);
            }
            if(keys.length == 0){
                r = r.substr(0,r.length-2)+os.EOL;
            }
        }

        return r += '    '.repeat(tabCount - 1) + ((isArray) ? '],' : '},') + os.EOL;
    } else {
        return (Number.isNaN(obj*1)?'\''+ obj +'\'':obj) +','+os.EOL;
    }
};

module.exports = Controller;
//console.log(prettyJson({
//    a:{
//        b:1,
//        c:2
//    }
//},0));
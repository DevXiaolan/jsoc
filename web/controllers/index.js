/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
var fs = require('fs');
var async = require('async');
var Controller = {};

Controller.plansCache = {};

Controller.index = function (req,res) {
    res.html('index.html');
};

Controller.plans = function(req,res){
    var files = fs.readdirSync(process.cwd()+'/../apiDocs');
    async.each(files, function (it, cb) {
        var _tmp = require(process.cwd()+'/../apiDocs/'+it);
        Controller.plansCache[_tmp.name?_tmp.name:it.split('.')[0]] = _tmp;
        cb(null,null);
    }, function (err, ret) {

        res.json(200,Object.keys(Controller.plansCache));
    });
};

Controller.detail = function(req,res){
    var plan = req.query.plan;
    if(Controller.plansCache[plan]){
        res.json(200,Controller.plansCache[plan]);
    }else{
        res.json(404,{},'plan not found');
    }
}

module.exports = Controller;
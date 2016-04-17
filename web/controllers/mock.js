/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
var fs  =require('fs');

var config = require('../config/config.js');
var isType = require('../../libs/func/isType.js');
var makeData = require('../../libs/func/makeData.js');
var Controller = {};

Controller.index = function (req,res) {
    res.render('index.html');
};

Controller.mock = function(req,res){
    if(config.apis){
        delete require.cache[require.resolve('../../apiDocs/'+config.apis)];
        var apis = require('../../apiDocs/'+config.apis).apis;
        var route = false;
        for(let k in apis){
            if(matchUrl(req,apis[k])){
                route = apis[k];
                break;
            }
        }

        if(route && checkRequest(req,route)){
            res.json(200,response(route.return.data),'');
        }else {
            res.json(400, {},'请求有误，请检查参数与请求方法');
        }
    }else{
        res.json(400,{},'config.apis 为定义');
    }
};
/**
 *
 * @param uri pathinfo
 * @param route route object
 * @param method req.method
 * @returns {boolean}
 */
var matchUrl = function (req, route) {
    var uri = req.url.split('?')[0];
    var method = req.method.toLowerCase();
    var uriReg = toRegExp(route.uri);
    return !! (new RegExp(uriReg,'i').test(uri) && method == route.method.toLowerCase());
};

var toRegExp = function (route) {
    var r = route.replace(/{.+}/ig,'[a-zA-Z0-9]+');
    return '^'+r.replace(/\//ig,'\\/')+'$';
};

var checkRequest = function (req, route) {

    for(let k in route.body){
        //if(!isType(route.body[k].type,req.body[k])){
        if(!checkType(route.body,req.body)){
            console.log('body error');
            return false;
        }
    }

    for(let k in route.query){
        //if(!isType(route.query[k].type,req.query[k])){
        if(!checkType(route.query,req.query)){
            console.log('query error');
            return false;
        }
    }
    return true;
};

var checkType = function(obj,value){
    var sig = true;
    console.log(obj);
    if(obj._type) {
        if(obj._required==true ){
            return sig && isType(obj._type, value,obj._length);
        }
        else{
            return true;
        }
    }else{
        for(let k in obj){
            sig = sig && checkType(obj[k],value[k]);
        }
        return sig;
    }
};

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

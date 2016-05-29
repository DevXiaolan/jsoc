/**
 * Created by lanhao on 15/5/17.
 */
'use strict';
let fs  =require('fs');

let config = require('../config/config.js');
let isType = require('../../libs/func/isType.js');
let makeData = require('../../libs/func/makeData.js');
let Controller = {};

Controller.index = (req,res) => {
    res.render('index.html');
};


Controller.mock = (req,res) => {
    if(config.apis){
        delete require.cache[require.resolve('../../apiDocs/'+config.apis)];
        let apis = require('../../apiDocs/'+config.apis).apis;
        let route = false;
        for(let k in apis){
            if(matchUrl(req,apis[k])){
                route = apis[k];
                break;
            }
        }

        if(route && checkRequest(req,route)){
            let data = response(route);
            res.raw(data.code,data.headers,data.body);
        }else {
            res.json(400, {},'请求有误，请检查参数与请求方法');
        }
    }else{
        res.json(400,{},'config.apis 为定义');
    }
};
/**
 *
 * @param req
 * @param route
 * @returns {boolean}
 */
let matchUrl = (req, route) => {
    let uri = req.url.split('?')[0];
    let method = req.method.toLowerCase();
    let uriReg = toRegExp(route.uri);
    return !! (new RegExp(uriReg,'i').test(uri) && method == route.method.toLowerCase());
};

/**
 *
 * @param route
 * @returns {string}
 */
let toRegExp = (route) => {
    let r = route.replace(/{.+}/ig,'[a-zA-Z0-9]+');
    return '^'+r.replace(/\//ig,'\\/')+'$';
};

/**
 *
 * @param req
 * @param route
 * @returns {boolean}
 */
let checkRequest = (req, route) => {

    if(!checkType(route.body,req.body)){
        console.log('body error');
        return false;
    }

    if(!checkType(route.query,req.query)){
        console.log('query error');
        return false;
    }
    return true;
};

/**
 *
 * @param obj
 * @param value
 * @returns {*}
 */
let checkType = (obj,value) => {
    let sig = true;
    if(obj._type) {
        if(obj._required==true ){
            return sig && isType(obj._type, value,obj._length);
        }
        else{
            return true;
        }
    }else{
        for(let k in obj){
            sig = sig && checkType(obj[k],(value && value[k])?value[k]:null);
        }
        return sig;
    }
};

/**
 *
 * @param route
 * @returns {{}}
 */
let response = (route) => {
    let result = {};
    let retData = route.return;
    if(retData){
        if(typeof retData == 'object' && !((retData._type) || (retData._assert))){
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

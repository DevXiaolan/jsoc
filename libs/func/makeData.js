'use strict';

let makeData = function(type){
    var tmp = type.split(' ');
    type = tmp[0].toLowerCase();
    var ret = null;
    switch (type) {
        case 'string':
            ret = 'test_string_' + (Date.now() % 100000);console.log(tmp[1]);
            if(tmp[1]>0){
                ret = ret.substr(0-tmp[1],tmp[1]);
            }
            break;
        case 'number':
            ret = Math.floor(Math.random() * 99999999999);
            if(tmp[1]>0){
                ret = ret % (Math.pow(10,tmp[1]));
            }
            break;
        case 'mobile':
            ret = Number.parseInt('13800' + Math.floor(Math.random() * 777777 + 152718));
            break;
        case 'email':
            ret = 'test_email_' + (Date.now() % 1000000) + '@test.cn';
            break;
        case 'password':
            ret = '123456';
            break;
        case 'object':
            return {'a':1};
            break;
        case 'array':
            return ['a','b','c'];
            break;
        default :
            ret = null;
            break;
    }
    return ret;
};

module.exports = makeData;

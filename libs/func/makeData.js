'use strict';

let makeData = function(type,length){
    //console.log(type);
    type = (type && typeof type == 'string')?type.toLowerCase():type;
    var ret = null;
    switch (type) {
        case 'string':
            ret = 'string_' + Date.now();
            if(length){
                ret = ret.substr(0,length);
            }
            break;
        case 'number':
            ret = Math.floor(Math.random() * 99999999999);
            if(length){
                ret = ret % (Math.pow(10,length));
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
            ret = type;
            break;
    }
    return ret;
};

module.exports = makeData;

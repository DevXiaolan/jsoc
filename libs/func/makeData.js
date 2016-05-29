'use strict';

let makeData = function(item){
    let type = item._type;
    let assert = item._assert;
    let length = item._length;
    let choices = item._choices?item._choices.split(','):[];

    type = (type && typeof type == 'string')?type.toLowerCase():type;

    if(assert != undefined){
        return assert;
    }

    if(choices.length>0){
        return choices[Number.parseInt(Math.random()*choices.length)];
    }

    var ret = null;
    switch (type) {
        case 'string':
            ret = 'string_' + (''+Date.now()).repeat(2);
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
        case 'bool':
            return !!(Date.now()%2);
            break;
        default :
            ret = '';
            break;
    }
    return ret;
};

module.exports = makeData;

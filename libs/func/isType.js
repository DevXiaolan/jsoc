'use strict';

let isType = function(type,val,length){
    type = (type && typeof type == 'string')?type.toLowerCase():type;
    if(length && (''+val).length!=length){
        return false;
    }
    switch (type){
        case 'string':
            return typeof val === 'string';
            break;
        case 'number':
            return /[0-9]+/.test(val);
            break;
        case 'mobile':
            return /1[0-9]{10}/.test(val);
            break;
        case 'email':
            return /[A-Za-z0-9]+@[A-Za-z0-9]+.[A-Za-z0-9]+/.test(val);
            break;
        case 'password':
            return val == 123456;
            break;
        case 'null':
            return val === null;
            break;
        case 'object':
            return typeof val == 'object' && !Array.isArray(val);
        case 'array':
            return Array.isArray(val);
            break;
        case 'bool':
            return val===true || val===false;
            break;
        default :
            break;
    }
};

module.exports = isType;

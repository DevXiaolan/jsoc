/**
 * Created by lanhao on 16/8/2.
 */

'use strict';
const fs = require('fs');
const os = require('os');
const EOL = (os && os.EOL)?os.EOL:'\n';

let obj2comment = function (obj) {
  let output = '/** '+EOL+' * @jsoc '+EOL;
  output += rParse(obj, 1);
  return output +' */';
};

let rParse = function (obj, indent) {
  let output = '';
  for(let k in obj){
    output += ' * '+' '.repeat(indent*2);
    output += k;
    if(typeof obj[k] !== 'object'){
      output += ':'+obj[k]+EOL;
    }else{
      output += EOL+rParse(obj[k],indent+1);
    }

  }
  return output;
};

module.exports = obj2comment;

console.log(obj2comment({
  name: 'test',
  request: {
    query: {
      appId: {
        _type:'number'
      }
    }
  },
  response: {
    body: {
      code :{
        _assert:200
      },
      data: {
        _type:'object'
      }
    }
  }
}));
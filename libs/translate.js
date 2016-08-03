/**
 * Created by lanhao on 16/8/1.
 */

'use strict';
const os = require('os');
const EOL = (os && os.EOL)?os.EOL:'\n';

class translate{
  constructor(){
    this.indent = '  ';
    this.buf = {};
    this.jsdoc = /\/\*\*([\s\S]*?)\*\//gm;
  };



  loadContent(content){
    let matches = content.match(this.jsdoc);
    this.buf.apis = this.buf.apis || {};
    for(let k in matches){
      if(matches[k].indexOf('@jsoc')!== -1) {
        if(matches[k].indexOf('@jsoc.host')!== -1){
          this.buf.host = matches[k].replace(/\/\*|\*\/|\*|@jsoc.host|\s+/g, '');
          continue;
        }
        let lines = matches[k].replace(/\/\*|\*\/|\*|@jsoc/g, '').split('\n');
        let api = this.transformHelper(lines, 0);
        if(api.name){
          this.buf.apis[api.name] = api;
        }
      }
    }
  };

  transformHelper(lines, baseLevel) {
    const ret = {};
    while(lines.length > 0) {
      const line = lines.shift();
      if(line.trim() === '')continue;
      const level = this.getIndentLevel(line);
      if (level < baseLevel) {
        lines.unshift(line);
        return ret;
      }
      if (this.isKV(line)) {
        const [k, v] = this.parseKV(line.trim());
        ret[k] = v;
      } else {
        const k = line.trim();
        ret[k] = this.transformHelper(lines, level + 1);
      }
    }
    return ret;
  };

  parseKV(str) {
    return str.split(':').map(x => {
      return x = x.trim();
    });
  };

  getIndentLevel(str) {
    return Math.floor(str.match(/^\s*/)[0].length / this.indent.length);
  };

  isKV(str) {
    return str.indexOf(':') !== -1;
  };

  toFile() {
    let content = '\'use strict\';'+os.EOL;
    content += 'module.exports = ';
    content += JSON.stringify(this.buf,null,4);
    content += ';'+os.EOL;
    return content;
  };
}

module.exports = translate;
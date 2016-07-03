'use strict';

const faker = require('faker');

let makeData = function (item) {
  let type = item._type;
  let assert = item._assert;
  let length = item._length;
  let choices = item._choices ? item._choices.split(',') : [];

  type = (type && typeof type == 'string') ? type.toLowerCase() : type;

  if (assert !== undefined) {
    return assert;
  }

  if (choices.length > 0) {
    return choices[Number.parseInt(Math.random() * choices.length)];
  }

  var ret = null;
  switch (type) {
    case 'string':
      ret = faker.random.word();
      if (length) {
        ret = ret.substr(0, length);
      }
      break;
    case 'number':
      let options = {};
      if (length) {
        options['max'] = Number.parseInt('1'+'0'.repeat(length)) - 1;
      }
      ret = faker.random.number(options);

      break;
    case 'mobile':
      ret = faker.phone.phoneNumber('1##########');
      break;
    case 'fullmobile':
      ret = '86-' + faker.phone.phoneNumber('1##########');
      break;
    case 'email':
      ret = faker.internet.email();
      break;
    case 'password':
      ret = faker.internet.password();
      break;
    case 'object':
      return {'a': 1};
      break;
    case 'array':
      return ['a', 'b', 'c'];
      break;
    case 'bool':
      return faker.random.boolean();
      break;
    default :
      ret = '';
      break;
  }
  return ret;
};

module.exports = makeData;


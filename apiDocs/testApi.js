'use strict';
module.exports = {
    "host": "http://127.0.0.1:3001",
    "apis": {
        'user': {
            name: 'user',
            uri: '/test/user/{uid}',
            method: 'get',
            header: {
                appId:{
                    _type:'Number',
                    _length:8
                }
            },
            query:{
                time: {
                    _type: 'Number',
                    _length:10
                }
            },
            body: {
            }
            ,
            return: {
                code: {
                    _type: 'Number',
                    _assert: 200
                }
                ,
                data: {
                    uid:{
                        _type:'Number',
                        _length:10,
                        _to:'temp_uid'
                    },
                    profile:{
                        tel:{
                            _type:'Number',
                            _length:'11'
                        },
                        email:{
                            _type:'string'
                        }
                    }
                }
                ,
                msg: {
                    _type: 'String'
                }
            }
        },
        'order': {
            name: 'order',
            uri: '/test/order',
            method: 'get',
            header: {
            },
            query:{
            },
            body: {
            },
            return: {
                code: {
                    _type: 'Number',
                    _assert: 200
                }
                ,
                data: {
                    _type:'Array'
                }
                ,
                msg: {
                    _type: 'String'
                }
            }
        },
        "test": {
            "name": "test",
            "uri": "/test/lalala",
            "method": "get",
            "header": {
                "appId": {
                    "_type": "Number",
                    "_length": "8"
                }
            },
            "query": {
                "time": {
                    "_type": "String",
                    "_length": "11",
                    "_required": "true"
                }
            },
            "body": {
                "content": {
                    "tel":{
                        "_type": "Number",
                        "_required": "false"
                    },
                    "email":{
                        "_type":"Email"
                    }
                }
            },
            "return": {
                "code": {
                    "_type": "Number",
                    "_assert": 200
                },
                "data":{
                    "tel":{
                        "value":{
                            "_type": "Number",
                            "_assert":110
                        },
                        "note":{
                            "_assert":"home"
                        }
                    },
                    "email":{
                        "_type":"Email"
                    }
                }
            }
        }
    }
};

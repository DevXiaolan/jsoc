'use strict';
module.exports = {
    "host": "http://127.0.0.1:3001",
    "apis": {
        'user': {
            name: '测试接口之用户示例',
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
                            _type:'Email',
                            _length:20
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
            name: '测试接口之订单示例',
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
            "name": "测试接口之test示例",
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

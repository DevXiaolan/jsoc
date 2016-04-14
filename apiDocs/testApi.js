'use strict';
module.exports = {
    "host": "http://127.0.0.1:3001",
    "apis": {
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

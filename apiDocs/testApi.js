'use strict';
module.exports = {
    "host": "http://127.0.0.1:3001",
    "apis": {
        "user": {
            "name": "用户示例",
            "request": {
                "uri": "/test/user/{uid}",
                "method": "get",
                "headers": {
                    "appId": {
                        "_type": "Number",
                        "_length": 8
                    }
                },
                "query": {
                    "time": {
                        "_type": "Number",
                        "_length": 10
                    }
                },
                "body": {}
            },
            "response": {

                "headers":{
                    "content-type":{
                        "_type":"String",
                        "_assert":"application/json"
                    }
                },
                "body": {
                    "code": {
                        "_type": "Number",
                        "_assert": 200
                    },
                    "data": {
                        "uid": {
                            "_type": "Number",
                            "_length": 10,
                            "_to": "temp_uid",
                            "_choices": "3,5,7"
                        },
                        "profile": {
                            "tel": {
                                "_type": "Number",
                                "_length": "11"
                            },
                            "email": {
                                "_type": "Email",
                                "_length": 20
                            }
                        }
                    },
                    "msg": {
                        "_type": "String"
                    }
                }
            }
        }
    }
};

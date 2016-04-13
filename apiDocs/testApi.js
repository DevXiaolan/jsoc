'use strict';
module.exports = {
    "host": "http://127.0.0.1:3001",
    "apis": {
        "user": {
            "name": "user",
            "uri": "/test/user/{uid}",
            "method": "get",
            "header": {
                "appId": {
                    "type": "Number",
                    "length": "7"
                }
            },
            "query": {
                "time": {
                    "type": "Number",
                    "length": 10
                }
            },
            "body": {},
            "return": {
                "code": {
                    "type": "Number",
                    "assert": 200
                },
                "data": {
                    "uid": {
                        "type": "Number",
                        "length": 10,
                        "to": "temp_uid"
                    },
                    "profile": {
                        "tel": {
                            "type": "Number",
                            "length": 11
                        },
                        "email": {
                            "type": "Email"
                        }
                    }
                },
                "msg": {
                    "type": "String"
                }
            }
        },
        "order": {
            "name": "order",
            "uri": "/test/order",
            "method": "get",
            "header": {
                "appId": {
                    "type": "String",
                    "length": "5"
                }
            },
            "query": {
                "time": {
                    "type": "Number",
                    "length": "11"
                }
            },
            "body": {
                "order": {
                    "type": "Object"
                }
            },
            "return": {
                "code": {
                    "type": "Number",
                    "assert": 200
                },
                "data": {
                    "type": "Array"
                },
                "msg": {
                    "type": "String"
                }
            }
        },
        "test": {
            "name": "test",
            "uri": "/test/lalala",
            "method": "get",
            "header": {
                "appId": {
                    "type": "Number",
                    "length": "6"
                }
            },
            "query": {
                "time": {
                    "type": "String",
                    "length": "11",
                    "required": "true"
                }
            },
            "body": {
                "content": {
                    "type": "Object",
                    "required": "false"
                }
            },
            "return": {
                "code": {
                    "type": "Number",
                    "length": "",
                    "assert": "200"
                }
            }
        }
    }
};

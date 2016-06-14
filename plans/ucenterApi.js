'use strict';
module.exports = {
    "host": "http://usersvcs.blues.tff.com",
    "apis": {
        "sendSMS": {
            "name": "send_sms",
            "request": {
                "uri": "/mobileVerify",
                "method": "post",
                "headers": {
                    "appid": {
                        "_type": "String",
                        "_length": "16"
                    }
                },
                "body": {
                    "mobile": {
                        "_from": "mobile",
                        "_to": "mobile",
                        "_type": "String",
                        "_length": "32",
                        "_required": true
                    },
                    "action": {
                        "_from": "action",
                        "_length": "",
                        "_assert": "RG",
                        "_type": "String"
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "Number",
                        "_length": 6,
                        "_to": "code"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "mobileVerify": {
            "name": "verify_mobile",
            "request": {
                "uri": "/confirmMobileVerify",
                "method": "post",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {
                    "mobile": {
                        "_type": "mobile",
                        "_from": "mobile"
                    },
                    "verifyCode": {
                        "_length": 6,
                        "_type": "Number",
                        "_from": "code"
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "String"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "authByCode": {
            "name": "动态密码登录",
            "request": {
                "uri": "/user/authByCode",
                "method": "post",
                "headers": {
                    "appid": {
                        "_type": "String"
                    },
                    "storeId": {
                        "_type": "Number",
                        "_length": "1"
                    }
                },
                "body": {
                    "mobile": {
                        "_type": "mobile",
                        "_from": "mobile"
                    },
                    "code": {
                        "_type": "number",
                        "_from": "code"
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "object"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "create": {
            "name": "创建用户",
            "request": {
                "uri": "/user",
                "method": "post",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {
                    "mobile": {
                        "_type": "Mobile",
                        "_to": "username"
                    },
                    "password": {
                        "_type": "Password",
                        "_to": "password"
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "id": {
                            "_type": "Number",
                            "_to": "uid"
                        },
                        "mobile": {
                            "_type": "Mobile"
                        },
                        "email": {
                            "_type": "String"
                        }
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "auth": {
            "name": "校验用户",
            "request": {
                "uri": "/user/auth",
                "method": "post",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {
                    "username": {
                        "_type": "String",
                        "_from": "username"
                    },
                    "password": {
                        "_type": "password",
                        "_from": "password"
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "object"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "getProfile": {
            "name": "查看基本信息",
            "request": {
                "uri": "/user/{uid}/profile",
                "params": {
                    "uid": {
                        "_type": "number",
                        "_length": 10,
                        "_from": "uid"
                    }
                },
                "method": "get",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {}
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "object"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "modifyProfile": {
            "name": "修改基本信息",
            "request": {
                "uri": "/user/{uid}/profile",
                "params": {
                    "uid": {
                        "_type": "number",
                        "_length": 10,
                        "_from": "uid"
                    }
                },
                "method": "put",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {
                    "email": {
                        "_type": "Email"
                    },
                    "firstname_en": {
                        "_type": "String"
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "object"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "addExp": {
            "name": "增加成长值",
            "request": {
                "uri": "/user/{uid}/exp",
                "params": {
                    "uid": {
                        "_type": "number",
                        "_length": 10,
                        "_from": "uid"
                    }
                },
                "method": "post",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {
                    "value": {
                        "_type": "Number"
                    },
                    "type": {
                        "_type": "String"
                    },
                    "comment": {
                        "_type": "String"
                    },
                    "ext": {
                        "_type": "Object"
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "Number"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "expHistory": {
            "name": "成长值历史记录",
            "request": {
                "uri": "/user/{uid}/exp/history",
                "params": {
                    "uid": {
                        "_type": "number",
                        "_length": 10,
                        "_from": "uid"
                    }
                },
                "method": "get",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "query": {
                    "size": {
                        "_type": "Number"
                    },
                    "pageNum": {
                        "_type": "Number"
                    }
                },
                "body": {}
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "Array"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "getExp": {
            "name": "查看成长值",
            "request": {
                "uri": "/user/{uid}/exp",
                "params": {
                    "uid": {
                        "_type": "number",
                        "_length": 10,
                        "_from": "uid"
                    }
                },
                "method": "get",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {}
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "Number"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "addPoint": {
            "name": "增减积分",
            "request": {
                "uri": "/user/{uid}/point",
                "params": {
                    "uid": {
                        "_type": "number",
                        "_length": 10,
                        "_from": "uid"
                    }
                },
                "method": "post",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {
                    "value": {
                        "_type": "Number"
                    },
                    "store_id": {
                        "_assert": 4
                    },
                    "type": {
                        "_type": "String"
                    },
                    "comment": {
                        "_type": "String"
                    },
                    "ext": {
                        "_type": "Object"
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "Number"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "pointHistory": {
            "name": "积分历史记录",
            "request": {
                "uri": "/user/{uid}/point/history",
                "params": {
                    "uid": {
                        "_type": "number",
                        "_length": 10,
                        "_from": "uid"
                    }
                },
                "method": "get",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "query": {
                    "size": {
                        "_assert": 10
                    },
                    "pageNum": {
                        "_assert": 1
                    }
                },
                "body": {}
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "Array"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "getPoint": {
            "name": "查看积分",
            "request": {
                "uri": "/user/{uid}/point",
                "params": {
                    "uid": {
                        "_type": "number",
                        "_length": 10,
                        "_from": "uid"
                    }
                },
                "method": "get",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {}
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_length": 6,
                        "_type": "Number"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "getBySns": {
            "name": "Sns获取用户信息",
            "request": {
                "uri": "/user/sns/{snsId}",
                "params": {
                    "snsId": {
                        "_type": "string",
                        "_length": 4,
                        "_from": "snsId"
                    }
                },
                "method": "get",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "query": {
                    "snsName": {
                        "_type": "String",
                        "_choices": "wechat",
                        "_required": true
                    }
                },
                "body": {}
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "object"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "bindSns": {
            "name": "Sns绑定用户",
            "request": {
                "uri": "/user/sns/{snsId}",
                "params": {
                    "snsId": {
                        "_type": "string",
                        "_from": "snsId"
                    }
                },
                "method": "put",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "body": {
                    "mobile": {
                        "_type": "mobile",
                        "_from": "mobile",
                        "_required": false,
                        "_choices": ""
                    },
                    "snsName": {
                        "_type": "String",
                        "_choices": "wechat,weibo",
                        "_required": true
                    },
                    "ext": {
                        "_type": "Object",
                        "_required": false
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "object"
                    },
                    "message": {
                        "_type": "String"
                    }
                }
            }
        },
        "getPassengerList": {
            "name": "获取出行人列表",
            "request": {
                "uri": "/user/{userId}/passenger",
                "method": "get",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "query": {},
                "body": {},
                "params": {
                    "userId": {
                        "_type": "Number",
                        "_length": "16",
                        "_assert": 1000957,
                        "_required": true,
                        "_choices": ""
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "array"
                    },
                    "message": {
                        "_type": "String",
                        "_assert":""
                    }
                }
            }
        },
        "getPassenger": {
            "name": "获取出行人详细",
            "request": {
                "uri": "/user/{userId}/passenger/{passengerId}",
                "method": "get",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "query": {},
                "body": {},
                "params": {
                    "userId": {
                        "_type": "Number",
                        "_length": "16",
                        "_assert": 1000957,
                        "_required": true,
                        "_choices": ""
                    },
                    "passengerId": {
                        "_type": "Number",
                        "_length": "10",
                        "_assert": 3,
                        "_required": true,
                        "_choices": ""
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "object"
                    },
                    "message": {
                        "_type": "String",
                        "_assert":""
                    },
                    "ext":{
                        "_type":"string"
                    }
                }
            }
        },
        "addPassenger": {
            "name": "新增出行人",
            "request": {
                "uri": "/user/{userId}/passenger",
                "method": "post",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "query": {},
                "body": {
                    "firstname_en":{
                        "_type":"string",
                        "_length":10
                    },
                    "lastname_en":{
                        "_type":"string",
                        "_length":10
                    },
                    "passport":{
                        "_type":"string",
                        "_length":20
                    },
                    "passport_expire":{
                        "_assert":"2016-12-30"
                    },
                    "mobile":{
                        "_type":"mobile"
                    },
                    "email":{
                        "_type":"email"
                    },
                    "gender":{
                        "_type":"number",
                        "_length":1,
                        "_choices":'0,1,2'
                    },
                    "dob":{
                        "_assert":"1968-12-30"
                    },
                    "nation":{
                        "_type":"string",
                        "_length":16,
                        "_assert":"USA"
                    }
                },
                "params": {
                    "userId": {
                        "_type": "Number",
                        "_length": "16",
                        "_assert": 1000957,
                        "_required": true
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "id":{
                            "_type":"number",
                            "_to":"passengerId"
                        }
                    },
                    "message": {
                        "_type": "String",
                        "_assert":""
                    }
                }
            }
        },
        "modifyPassenger": {
            "name": "修改出行人",
            "request": {
                "uri": "/user/{userId}/passenger/{passengerId}",
                "method": "put",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "query": {},
                "body": {
                    "mobile":{
                        "_type":"mobile"
                    },
                    "email":{
                        "_type":"email"
                    }
                },
                "params": {
                    "userId": {
                        "_type": "Number",
                        "_length": "16",
                        "_assert": 1000957,
                        "_required": true
                    },
                    "passengerId": {
                        "_type": "Number",
                        "_length": "10",
                        "_assert": 3,
                        "_required": true,
                        "_choices": ""
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_type": "object"
                    },
                    "message": {
                        "_type": "String",
                        "_assert":""
                    }
                }
            }
        },
        "removePassenger": {
            "name": "删除出行人",
            "request": {
                "uri": "/user/{userId}/passenger/{passengerId}",
                "method": "delete",
                "headers": {
                    "appid": {
                        "_type": "String"
                    }
                },
                "query": {},
                "body": {},
                "params": {
                    "userId": {
                        "_type": "Number",
                        "_length": "16",
                        "_assert": 1000957,
                        "_required": true
                    },
                    "passengerId": {
                        "_type": "Number",
                        "_length": "10",
                        "_from":"passengerId",
                        "_required": true,
                        "_choices": ""
                    }
                }
            },
            "response": {
                "body": {
                    "code": {
                        "_assert": 0
                    },
                    "data": {
                        "_assert": null
                    },
                    "message": {
                        "_type": "String",
                        "_assert":""
                    }
                }
            }
        }
    }
};

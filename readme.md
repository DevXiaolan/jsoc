# 一颗赛艇，

## 本地操作界面 
    step 1 : git clone
 
    step 2 : cd jsoc && npm install

    step 3 : cd web
             node server.js
    step 4 : http://127.0.0.1:3001   (default)
    
![](http://log.fyscu.com/usr/uploads/2016/04/1049222048.png)
    
## 命令行测试

    node main.js {projectName} [ all | {apiName} ]  [{jsonString}]
    
    projectName  :  在apiDocs目录下的文件名，不带js，如  testApi
    apiName  : 你的方案下的apis里的接口标识，如  user
    jsonString  :  通过一个json字符串，传入预设数据，如  '{"uid":1}'
    
    完整例子 :  node main.js testApi all '{"uid":1}'
![](http://log.fyscu.com/usr/uploads/2016/04/908170112.png)
    
## mock 服务

    启动本地web界面实际上同时提供了mock服务，http://127.0.0.1:3001 下会给你mock你配置的方案的接口的返回案例
    （需要在 /web/config/config.js 里制定 apis:{projectName} ）
    



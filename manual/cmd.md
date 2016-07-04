## Usage

    jsoc {PlanName} [option]
    
## Options

### -a ( --api )

测试指定的接口，支持多个，用半角逗号分隔，顺序执行

    jsoc testApi -a user    //执行 testApi 的 user 接口

    jsoc testApi --api user,order,test  //顺序执行 testApi 的 user,order,test 接口
    
### -b ( --body )
打印请求体信息及接口返回,boolean

    jsoc testApi -a user -b
    
### -c ( --color )
让打印信息色彩丰富 ，boolean  ，默认true  (所以说，没事就忽略这个参数)

### -d ( --data )
给接口注入预定义参数  （[关于预定义参数](#预定义参数)）

    jsoc testApi -a user -d '{"userID":1,"page":1}'  //json 字符串形式
    jsoc testApi -a user -d.userId 1 -d.page 1       // jsoc 参数形式 （ 推荐 ） 

### -l ( --list )
列出当前 `Plan` 的全部接口, 当 `-l` 参数生效时，其他参数一律忽略 

    jsoc testApi -l
    

## P.S.

### 预定义参数 
**定义：**

`jsoc` 对一个字段值的描述，有一个 `_from` 参数，表示字段值从 预定义参数池里加载。

    {
        _type:'string',
        _from:'userId',
        _required:true
    }
以上表示一个 字符串 类型的必填字段，从预定义参数池里的 `userId`加载。

**预定义参数的设置**
预定义参数池有两种设置方式：

- 在接口描述里设置,这种方式(通常)是在接口返回里定义,表示将一个字段的值存储到预定义参数池，以便上下文引用。
  比如在前一个接口的返回里，将 `orderId` 存储到预定义参数池，方便后续接口通过 `_from` 使用。

        {
            _type:'number',
            _to:'orderId'
        }
    
- 另一种方式是通过`jsoc`命令行参数前置设定，这种方式(通常)适用于一个(一组)接口的启动必须的预定义数据

        jsoc testApi -a user,updateUser,deleteUser -d.userId 1001    //指定一个userId，通常会被一个或多个接口依赖 

## JSOC

- ### jsoc entity 

	> jsoc entity 是描述一个字段属性的一种方式。
	
	在这里，字段被一系列属性来描述，比如：
	
	`_type`,`_length`,`_required` 等等，我们将在附录里完整地罗列出这些属性。
	要很好地使用 `jsoc`，需要充分熟悉每个属性的作用。
	
	为此，你可能要花10分钟来浏览一下 [附录](#) 。
	
	你并不需要立刻就熟记这些内容，现阶段，我们只要看一个例子就够了
	
		username : {
			_type: 'string',
			_required: true,
			_from: 'username',
			_default: 'Tom'
		}
	
	上面的例子表示，username 这个字段，是一个 `string`类型，并且是`必须`的,
	它的值可以从暂存区加载（[什么是暂存区?](#)）, 当暂存区无法提供时，默认值为`Tom` 。
	
	
- ### jsoc comment

	> jsoc comment 是我们代码里注释的一种写法，用来描述一个接口

	我们看一下这段注释：
	
		/**
		 * @jsoc.host http://127.0.0.1:3001
		 */
		
		/**
		 * @jsoc
		 *   name:api1
		 *   desc:a demo doc
		 *   group:test
		 *   request
		 *     method:get
		 *     uri:/demo/{id}
		 *     params
		 *       id
		 *         _type:number
		 *         _required:true
		 *     query
		 *       page
		 *         _type:number
		 *         _default:1
		 *   response
		 *     body
		 *       code
		 *         _type:number
		 *         _assert:200
		 *       data
		 *         _type:object
		 *       message
		 *         _type:string
		 *         _required:false
		 */
	
	第一段注释，直观地表名这套接口的`host`地址。
	
	重点在第二段，这是描述一个接口的模板，通过缩进2空格来表达层级关系，
	
	我们逐行解构一下：
	- @jsoc
	
			开始标记，表明这是一段 jsoc comment
	- name:api1
		
			这是接口名字 ， api1
	- desc: a demo doc
		
			描述，简要描述接口的作用
	- group:test
	
			接口分组，后续会支持这个功能，暂时没啥用
	- request
	
			注意 ！ request后面什么都没有，并且从下一行开始多了一级缩进，
			这里表示request是个对象。
	- method:get
	
			这个接口使用的http方法
	- uri:/demo/{id}
			
			表达了接口的 uri ，这里可以支持占位符({id})，
	- params ...
	
			params
			  id
			    _type:number
			    _required:true
			这里又是利用缩进来表达层次关系，
			表示params这个对象，包含一个 id 属性，
			id 是必填参数，类型为 number
			
			我们可以通过一个json对象来理解这一段注释：
			params:{
				id:{
					_type:'number',
					_required:true
				}
			}
			
			P.S. params和uri的关系？就是params描述了uri里的占位符 。
	- query , headers , body 
	
			基本和params一个模式，分别表示http请求中的几个关键，但并不是都必须的。
			一个足够简单的接口，甚至只有 method 、 uri 就够了
	- response
	
			和request对应的，这个是用来描述返回信息的。
			headers并不是必须，但是body是需要的。
			从上面这个例子里，我们这个接口可能会返回一下数据
			{
				code:200,
				data:{},
				message:'success'
			}
	- jsoc entity 的深层嵌套
	
			jsoc entity是支持嵌套的，
			比如上面的data字段，你可以只表明它是一个 object.
			又或者你可以更进一步描述这个object内部结构：
			code
		      _type:number
		      _assert:200
	        data
		       name
		         _type:string
		       age
		         _type:number
		       address
		         _type:string
		    message:
		      _type:string
		      _required:false
		 	
		 	像这样，我们就能够描述data里面的结构，理论上是支持无限等次的。

- ### jsoc document(markdown)

	当我们写好 `jsoc comment` ,我们可以通过简单的命令生成一份 `markdown`格式的接口文档。
	
	Step 1 ： 生成接口json描述文件
		
		jsoc -g {path_of_comment} -o {output_file}
		
		path_of_comment 是你编写jsoc comment的文件，也可以是一个目录。
		
		output_file 生成的文件名
		
		例子：
		jsoc -g route_demo/demo.js -o demo.js
		将会在 {jsoc_home}/plans/ 下生成一个 demo.js文件，
		生成的是一个标准 node module 。
	
	Step 2 ： 生成md文档文件
	
		jsoc -m demo
		这里的 demo 指的是plans目录下的文件名（不含 .js ）
		以上命令自动在 plans 目录生成一份 demo.md 文件。
		（暂不支持指定目录）

- ### jsoc mock
	
	json描述文件是`jsoc`很重要的部分，通过 `jsoc --gen `生成以后，
	就能使用其他`jsoc`功能，比如 mock 。
	
	假设你已经顺利生成 `plans/demo.js` ，否则请看前面章节。
	
	执行命令：
	
		jsoc --mock demo
		
	如果`mock`成功，将会看到看到
	
		Mock in demo
		listen on port:3001,ip:null
		.
		.   <------ nobody care about this point!!

	此时打开浏览器，尝试访问 
	
	`http://127.0.0.1:3001/demo/1` (前面章节定义的接口)
	
	深入学习 `jsoc entity` 描述，可以定制出更加丰富的返回格式，
	在`mock`中就能模拟出更加复杂的数据。
	
- ### jsoc test

	`jsoc`有一个激动人心的功能，可以测试在线接口，这是`jsoc`最精髓部分。
	
	前面我们定义 `demo` 的时候，有一个`jsoc.host`，
	如果我们正确地输入一个正在运行的线上地址，比如 `http://mydomain.com`。
	
	那么我们可以使用一套`jsoc`命令来自动构建请求，测试接口的正确性。
	
	基本用法
		
		jsoc {planName} [option]
	以`demo`为例：
	
	列出 demo 的全部接口
	
		jsoc demo -l     
	查看某个接口的描述
	
		jsoc demo -a api1 -i
	构造`http`请求测试某个接口
	
		jsoc demo -a api1 [-b]
		
		执行结果：
		测试接口：［api1]
		{
    		code : true
    		data : true
		}
		表示返回结果的code和data都符合预期。
		
		如果你想看到这个请求的详细信息，可以加上 -b 参数，将会打印请求体和返回体。

- ### 附录
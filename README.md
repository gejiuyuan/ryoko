# ryoko

ryoko，一个基于浏览器原生Fetch API的HTTP请求库。

<br>


### 特性

- 简易API设计
- 全局响应和请求拦截器
- 局部钩子：beforeRequest、afterResponse
- 延迟和手动终止一个或多个请求
- 下载进度监听
- URL前缀、Status验证
- 快捷操作语法，如：ryoko.post()
- 完善的错误提示

<br>

### 安装

使用npm：

```
npm install ryoko -S
```

使用cdn：

```
//unpkg
<script src="https://unpkg.com/ryoko/dist/ryoko.min.js"></script>

//jsdelivr
<script src="https://cdn.jsdelivr.net/npm/ryoko/dist/ryoko.min.js"></script>
```

<br>

### API

<br>

#### ryoko(config) 


通过传入config配置选项来新建一个ryoko请求

```
import ryoko from 'ryoko';

ryoko({
	method: 'post',
	url: '/guoxiaoyou/lalaal',
	data: {
		name: 'haha',
		age: 13,
	}
}).then(res => {
	console.info(res.data)
})

```


或者使用别名，如：

##### ryoko.get(url, config?)

##### ryoko.post(url, config?)

##### ryoko.put(url, config?)

##### ryoko.patch(url, config?)

##### ryoko.delete(url, config?)

##### ryoko.head(url, config?) 

#### <br>config配置详情：

```
{
	//请求方法，默认为get
	method: 'post',
	
	//请求的url
	url: '/guoxiaoyou',
	
	//prefixUrl，请求url的前缀，默认：''空字符串
	prefixUrl: 'https://www.guoxiaoyou.cn',
	
	//url查询参数，类型：String | PlainObject纯对象 | URLSearchParams
	params: {
		name: 'guoxiaoyou'.
		age: '10'
	},
	
	//headers为自定义请求头，类型：Headers | Record<string,string>
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	
	//data请求体，用于fetch.body选项，类型：BodyInit
	//若为PlainObject纯对象，如{a:2,b:3}，内部将使用JSON.stringify转译
	data: new URLSearchParams(),
	
	//超时时间，默认0，即不取消请求
	timeout: 10000,
	
	//超时后触发的函数，参数：超时取消信息
	onDefer(deferMsg){
		
	},
	
	//下载进度监听
	downloadScheduler({
		percent, //百分百
		total, //总长度（字节）
		received, //当前得到的长度
		buffer, //所得资源二进制数据
	}) {
		
	}
	
	//响应状态码验证
	verifyStatus(status) {
		return status > 200
	},
	
	//请求前钩子
	beforeRequest(config) {
		
	},
	
	//响应后钩子
	afterResponse(response) {
	
	},
	
	//终止请求令牌
	abortToken,
	
	//是否自动携带上cookie，默认'same-origin‘（同源情况下），其它可选值：'omit'、'include'
	//特别的，为true时，即表示'include'，false对应'omit'
	credentials: true,
	
	//响应数据类型，默认：'text'，其它可选值：'arrayBuffer' | 'text' | 'json' | 'formData' | 'blob'
	responseType: 'json',
	
	//自定义fetch函数，如引入的polyfill
	fetch: fetchPolyfill
	
}
```

除此之外还继承了fetch请求原生的mode、integrity、redirect、cache、referrer、referrerPolicy等配置选项。详见（[`MDN之fetch API文档参考`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch)）

<br>

#### ryoko静态方法或属性 

- ryoko.AbortTokenizer：终止ryoko请求的令牌控制器

- ryoko.create：创建一个新的请求实例

- ryoko.all：并发处理（等待多个）ryoko请求，基于Promise.all实现

- ryoko.spread：可在处理完并发请求后调用，如： 

  

  ```
  const req = ryoko.get('/ddd')
  const req2 = ryoko.get('/ccc')
  
  ryoko.all(req, req2).then(ryoko.spread((res1, res2) => {
  	//res1、res2分别对应第一、二个请求的响应结果
  }))
  ```
  
  
  
- ryoko.Ryoko：即ryoko请求对象的原始构造类

<br>

#### 创建ryoko实例 

使用ryoko.create方法即可创建新的请求实例，一般还会传递一些默认参数，如timeout、prefixURL等。

```
const anfrage = ryoko.create({
	timeout: 1000,
	prefixURL: 'https://www.guoxiaoyou.cn'
})
anfrage.defaults.onDefer = function() { 
	console.info('请求超时了')
}
```

注意，若后续请求中具有相同配置，则遵循后入为主原则。如：

```
anfrage.get('/ddd', {
	timeout: 800
})
```

此时timeout为800毫秒。

<br>


#### 拦截器 

在正式请求前或响应后砸门往往需要处理某些工作，如给请求头加上token、loading动画加载等，拦截器则能很好地满足需求。如： 

```
//请求拦截器
ryoko.interceptors.request.use((config) => {
	config.headers['Authorization'] = localStorage.getItem('token');
	return config;
},(err) => {
	return Promise.reject(err)
})

//响应拦截器
ryoko.interceptors.response.use(function(response) {
	return response
}, (err) => {
	return Promise.reject(err)
})
```

如果需要移除拦截器，可使用：

```
const inter = ryoko.interceptors.response.use((res) => {
	return res
})
ryoko.interceptors.response.eject(inter);
```


特别的，需要注意拦截器与局部钩子beforeRequest、afterResponse的差异。比如说：

1、执行顺序上：全局request拦截器 > 局部beforeRequest钩子 > 局部afterResponse钩子 > 全局response拦截器

```
//请求拦截器
ryoko.interceptors.request.use((config) => {
	console.info(1)
	return config;
})

//响应拦截器
ryoko.interceptors.response.use(function(response) {
	console.info(4)
	return response
})

ryoko.get({
	beforeRequest(config) {
		console.info(2)
	},
	afterResponse(response) {
		console.info(3)
	}
})

//执行后依次打印：1、2、3、4
```

2、全局拦截器必须将config或response参数返回，局部的beforeRequest、afterResponse钩子则不作要求；

<br>

#### 下载进度监听 

前文已经提及，在配置选项中加入downloadSchduler即可监听下载进度。如：

```
ryoko.get('/ddd', {
	downloadSchduler({percent, received, total, buffer}) {
		
	}
})
```

该方法接受一个形参：downloadInfo下载信息，该参数又包含四个属性：

- percent：下载进度百分比
- received：实时获取的字节长度
- total：总字节长度
- buffer：获取到的资源数据（Uint8Array类型） 

注意点：此方法基于请求响应头的Content-length实现（因为fetch并未提供类似XHR的原生下载进度监测事件），所以对于没有Content-Type响应头参数的会无效。

<br>

#### ryokoResponse响应数据 

```
{
	//请求配置，类型：ryokoMergeConfig
	config,
	
	//headers响应头，类型：PlainObject纯对象
	headers,
	
	//响应状态码
	status,
	
	//响应状态内容
	statusText,
	
	//fetch请求返回值
	source,
	
	//被处理后的fetch请求返回值，如res.json()
	data
}
```

<br>

注意，data是根据传入的responseType才被处理后的响应数据，而source选项才是真正的fetch请求后的返回值。



#### 取消请求控制 


第一种是设置timeout，若请求超时，则自动终止，同时触发onDefer回调。此外，用户也可手动取消。如：

```
import ryoko, { abortPendingRequest } from 'ryoko'

//获取请求终止令牌器
const AbortTokenizer = ryoko.AbortTokenizer;

// 创建一个终止令牌
const creatorToken = AbortTokenizer.createToken();

//再讲令牌token赋值给请求
ryoko.get('/ddd', {
	abortToken: creatorToken
})

//延迟120毫秒取消请求（如果该请求未完成）
setTimeout(() => {
	abortPendingRequest(creatorToken)
}, 120)

```

上述代码可以看到，取消一个请求需经过三个步骤：首先拿到终止控制器（AbortTokenizer），然后通过createToken方法创建终止令牌标识（一个Symbol值），它需赋予请求的abortToken选项，后续借助调abortPendingRequest方法便可取消对应请求。 

同样，该方法适用于取消多个请求场景。如： 

写法一：abortToken添加在基础配置选项上 

```

const AbortTokenizer = ryoko.AbortTokenizer;
const creatorToken = AbortTokenizer.createToken();

let afrange = ryoko.create({
	abortToken: creatorToken
})

anfrage.get('/ddd', {
	params: {
		age: 10
	}
})

anfrage({
	method: 'post',
	url: '/sss',
	data: JSON.strigify({a:1,b:2})
})

//此时两个请求都将被取消（如果还没请求完成）
setTimeout(() => {
	abortPendingRequest(createToken)
}, 20)

```

写法二：逐个添加abortToken 
```
const AbortTokenizer = ryoko.AbortTokenizer;
const creatorToken = AbortTokenizer.createToken();
 
ryoko.get('/ddd', {
	params: {
		age: 10
	},
	abortToken: creatorToken
})

ryoko({
	method: 'post',
	url: '/sss',
	data: JSON.strigify({a:1,b:2}),
	abortToken: creatorToken
})

//此时两个请求都将被取消（如果还没请求完成）
setTimeout(() => {
	abortPendingRequest(createToken)
}, 20)
```

<br>

#### 关于运行环境 

ryoko提供fetch选项方便用户使用自定义fetch方法。如对于在2015年之前发布的、不支持fetch的浏览器，可引入whatwg-fetch、node环境也可依托node-fetch。 

```
//在老版浏览器
import {fetch as fetchPolyfill} from 'whatwg-fetch';

ryoko({
	url: 'ddd',
	fetch: fetchPolyfill
})

//在node环境
const fetchNode = require('node-fetch');
ryoko.get('/ddd', {
	fetch: fetchNode
})
```

<br>

#### 作者 

[`果小右——gejiuyuan.gitee.io😊`](https://gejiuyuan.gitee.io/)
<br>
<br>
<br>
<br>

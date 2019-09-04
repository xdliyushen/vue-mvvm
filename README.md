### 废话池
vue的实现核心是Object.defineProperty()
观察者模式是一种一对多的模式，使用该模式可以使双向绑定更有效率。

Object.defineProperty()参数介绍
1. 要操作的对象
2. 要操作的属性
3. 属性的特性，是一个对象的形式，一般有set、get两个属性，还可能有writable，configurable，enumerable，value等。

还有一个方法叫Object.defineProperties()，与Object.defineProperty()功能类似，不同的是这个方法可同时操作多个属性。其第二个属性是一个对象，对象中属性名为第一个参数的属性名，值为属性特性。

vue实现双向绑定的方法是通过数据劫持结合发布-订阅者，通过Object.defineProperty()来劫持各个属性的get、set，在数据变动时发布消息给订阅者，触发相应的监听回调。

数据劫持的意思？
数据劫持就是通过Object.definePerproty()，去操作数据的get、set，通过在get、set中进行额外操作实现双向绑定。

### Vue双向绑定实现原理
vue实现双向绑定的方法是通过数据劫持结合发布-订阅者模式，通过通过Object.defineProperty()来劫持data对象各个属性的get、set，在数据变动时发布消息给订阅者，触发相应的监听回调。

### 思路简述
要实现mvvm的双向绑定，要实现以下步骤：    
1. 首先，实现一个数据监听器Observer，能够对数据对象的所有属性进行监听，如果有变动，可以拿到最新的值并通知订阅者。
2. 实现一个指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，并绑定相应的更新函数。
3. 实现一个Watcher，作为连接Observer和Compiler的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图。
4. mvvm入口函数，整合以上三者。

### 参考文章
https://segmentfault.com/a/1190000006599500



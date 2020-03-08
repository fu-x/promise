# 自己封装一个Promise

> 我们先对Promise进行分析
#### Promise的三种状态：pending、fulfilled、rejected

#### Promise默认方法（constructor）
* 需要接受一个函数并执行,函数需要调用内部resolved和rejected方法
* 需要定义一个保存异步函数的私有属性
* 需要定义一个保存当前状态的私有属性
* `resolved`方法：执行成功的异步函数
* `rejected`方法：执行失败的异步函数

#### promise的私有方法：then
1. 需要接受两个回调函数参数：`onFulfilled`、`onRejected`
2. 需要分别对三种状态进行处理
3. 参数可以为空，并且不改变状态
4. 回调函数中可以返回一个Promise对象
5. then需要返回一个Promise对象
6. 可以实现链式调用
7. 当前Promise状态不影响下个Promise状态。

#### promise的静态方法：resolve
* 返回一个Promise对象
* 可以接受一个Promise对象作为参数
* 如果参数为Promise对象，返回的Promise状态为参数的Promise状态
* 如果参数不是Promise对象，返回的Promise状态为成功
#### promise的静态方法：reject
* 返回一个Promise对象
* 返回的Promise状态为失败

#### promise的静态方法：all
* 返回一个Promise对象
* 接受一个数组，数组元素为Promise对象
* 数组中的所有promise元素状态为成功，则返回promise状态为成功，否则为失败

#### promise的静态方法：race
* 返回一个Promise对象
* 接受一个数组，数组元素为Promise对象
* 返回一个promise状态为数组中执行最快的promise状态
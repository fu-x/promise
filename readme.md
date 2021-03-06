# 自己封装一个Promise
> 代码：https://github.com/fu-x/promise
> 首先我们需要对Promise进行分析
#### 声明一个MyPromise类
```javascript
class MyPromise {} // 声明MyPromise类
```
#### Promise的三种状态：pending、fulfilled、rejected
我们要在类里定义三个静态常量
```javascript
static PENDING = 'pending'; // pending状态表示正在执行中
static FULFILLED = 'fulfilled'; // fulfilled状态表示执行成功
static REJECTED = 'rejected'; // rejected状态表示执行失败
  ```
 #### Promise默认方法（constructor）
 * 需要接受一个函数并执行,函数需要调用内部resolved和rejected方法
* 需要定义一个保存异步函数的私有属性
* 需要定义一个保存当前状态的私有属性
 ```javascript
 constructor(executor) { // 构造函数，传入执行函数。
   this.status = MyPromise.PENDING; // 设置初始状态
   this.value = null;
   this.callbacks = []; // 存储pending状态回调函数
   try { // 异常检测
     executor(this.resolved.bind(this), this.rejected.bind(this)); // 执行函数
   } catch (error) {
     this.rejected(error) // 出错按rejected处理
   }
 }
 ```
#### resolved方法：执行成功的异步函数
```javascript
resolved(value) { // 成功的执行函数
  if (this.status === MyPromise.PENDING) { // 状态保护，仅处理pending状态
    this.status = MyPromise.FULFILLED; // 改变状态为fulfilled
    this.value = value;
    this.callbacks.forEach(callback => { // 遍历回调数组，执行pending状态下存入数组中成功的回调
      callback.onFulfilled(this.value);
    })
  }
}
  ```
#### rejected方法：执行失败的异步函数
```javascript
rejected(error) { // 失败的执行函数
  if (this.status === MyPromise.PENDING) { // 状态保护，仅处理pending状态
    this.status = MyPromise.REJECTED; // 改变状态为rejected
    this.value = error;
    this.callbacks.forEach(callback => { // 遍历回调数组，执行pending状态下存入数组中失败的回调
      callback.onRejected(this.value);
    })
  }
}
```
#### promise的私有方法：then
1. 需要接受两个回调函数参数：`onFulfilled`、`onRejected`
2. 需要分别对三种状态进行处理
3. 参数可以为空，并且不改变状态
4. 回调函数中可以返回一个Promise对象
5. then需要返回一个Promise对象
6. 可以实现链式调用
7. 当前Promise状态不影响下个Promise状态
8. 实现then的异步操作（setTimeout）
9. 异常检测，代码异常按照rejected状态处理
```javascript
// 实现then()方法。 onFulfilled和onRejected是用来处理成功和失败的回调函数
then(onFulfilled, onRejected) {
  // 如果回调函数传递的不是函数类型，则直接返回数据，实现then的穿透传递
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : () => this.value;
  onRejected = typeof onRejected === 'function' ? onRejected : () => this.value;
  // 链式调用，then 需要返回MyPromise
  let myPromise2 = new MyPromise((resolve, reject) => {
    // 如果当前状态为pending，将当前回调函数保存到数组中。
    if (this.status === MyPromise.PENDING) {
      this.callbacks.push({
        onFulfilled: value => {
          setTimeout(() => {    // 实现then的异步操作
            let result = onFulfilled(value);
            if(result === myPromise2){  // 限制返回对象不能为本身，因为异步执行可以调用到本身promise对象
              throw new TypeError('Chaining cycle detected');
            }
            try {     // 异常检测
              if(result instanceof MyPromise){  // 如果回调函数返回的仍是一个promise对象
                result.then(resolve, reject);  // 执行.then传入当前的成功和失败回调
              }else{
              resolve(result);   // 处理then返回的promise，返回resolve，不影响下一个then
              }
            } catch (error) {
              reject(error);
            }
          })
        },
        onRejected: value => {
          setTimeout(() => { // 实现then的异步操作
            let result = onRejected(value);
            if(result === myPromise2){  // 限制返回对象不能为本身，因为异步执行可以调用到本身promise对象
              throw new TypeError('Chaining cycle detected');
            }
            try { // 异常检测
              if(result instanceof MyPromise){  // 如果回调函数返回的仍是一个promise对象
                result.then(resolve, reject);  // 执行.then传入当前的成功和失败回调
              }else{
                resolve(result);   // 处理then返回的promise，返回resolve，不影响下一个then
              }
            } catch (error) {
              reject(error);
            }
          })
        }
      })
    // 如果成功，执行成功回调
    } else if (this.status === MyPromise.FULFILLED) {
        setTimeout(() => { // 实现then的异步操作
        let result = onFulfilled(this.value);
        if(result === myPromise2){  // 限制返回对象不能为本身，因为异步执行可以调用到本身promise对象
          throw new TypeError('Chaining cycle detected');
        }
        try { // 异常检测
          if(result instanceof MyPromise){  // 如果回调函数返回的仍是一个promise对象
            result.then(resolve, reject);  // 执行.then传入当前的成功和失败回调
          }else{
            resolve(result);   // 处理then返回的promise，返回resolve，不影响下一个then
          }
        } catch (error) {
          reject(error);
        }
      })
    // 如果失败，执行失败回调
    } else if (this.status === MyPromise.REJECTED) {
      setTimeout(() => { // 实现then的异步操作
        let result = onRejected(this.value);
        if(result === myPromise2){  // 限制返回对象不能为本身，因为异步执行可以调用到本身promise对象
          throw new TypeError('Chaining cycle detected');
        }
        try { // 异常检测
          if(result instanceof MyPromise){  // 如果回调函数返回的仍是一个promise对象
            result.then(resolve, reject);  // 执行.then传入当前的成功和失败回调
          }else{
            resolve(result);   // 处理then返回的promise，返回resolve，不影响下一个then
          }
        } catch (error) {
          reject(this.value);
        }
      })
    }
  })
  return myPromise2;
}
  ```
 #### promise的静态方法：resolve
* 返回一个Promise对象
* 可以接受一个Promise对象作为参数
* 如果参数为Promise对象，返回的Promise状态为参数的Promise状态
* 如果参数不是Promise对象，返回的Promise状态为成功
```javascript
// 实现promise静态方法resolve
static resolve(value){  
  return new MyPromise((resolve, reject)=>{   // resolve方法返回promise对象
    if(value instanceof MyPromise){   // 如果接受的参数的是一个promise对象
      value.then(resolve, reject);  // 调用then方法，返回参数promise状态
    }else{
      resolve(value);   // 如果不是promise对象，按成功处理
    }
  })
}
```
#### promise的静态方法：reject
* 返回一个Promise对象
* 返回的Promise状态为失败
```javascript
 // 实现promise静态方法reject
 static reject(value){  
   return new MyPromise((resolve, reject)=>{   // reject方法返回promise对象
     reject(value);    // 按失败处理
   })
 }
```
#### promise的静态方法：all
* 返回一个Promise对象
* 接受一个数组，数组元素为Promise对象
* 数组中的所有promise元素状态为成功，则返回promise状态为成功，否则为失败
```javascript
// 实现promise静态方法all，接受一个promise数组，返回一个promise对象
// 数组中的所有promise元素状态为成功，则返回promise状态为成功，否则为失败
static all(promises){ 
  return new MyPromise((resolve, reject)=>{
    const values = [];
    values.forEach(promise=>{
      promise.then((data)=>{
        values.push(data);
        if(values.length === promises.length){
          resolve(data);
        }
      }, (error)=>{
        reject(error);
      })
    })
  })
}
```
#### promise的静态方法：race
* 返回一个Promise对象
* 接受一个数组，数组元素为Promise对象
* 返回一个promise状态为数组中执行最快的promise状态
```javascript
// 实现promise静态方法race，接受一个promise数组
// 返回一个promise状态为数组中执行最快的promise状态
static race(promises){
  return new MyPromise((resolve, reject)=>{
    promises.forEach(promise=>{
      promise.then(data=>{
        resolve(data);
      }, error=>{
        reject(error);
      })
    })
  })
}
```
#### 到此我们的Promise就封装完成了，虽然看着比较复杂，但是只要我们搞懂每个方法和属性的作用，就知道它的逻辑其实很简单
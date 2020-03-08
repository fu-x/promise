const MyPromise = require('./myPromise');

let p = new MyPromise((res, rej)=>{
  rej(666);
})
let p1 = new MyPromise((res, rej)=>{
  res(666);
})
let p2 = new MyPromise((res, rej)=>{
  res(666);
})
let p3 = new MyPromise((res, rej)=>{
  setTimeout(()=>{
    res(666);
  }, 1000)
})
let p4 = new MyPromise((res, rej)=>{
  setTimeout(()=>{
    rej(666);
  },2000)
})
MyPromise.reject(p).then(data=>{
  console.log('success' + data);
},error=>{
  console.log(error);
})
Promise.reject(p).then(null, error=>{
  console.log(error);
})
Promise.all([p1, p2]).then(data=>{
  console.log('成功');
}, error=>{
  console.log('失败');
})
Promise.race([p3, p4]).then(data=>{
  console.log('成功');
}, error=>{
  console.log('失败');
})
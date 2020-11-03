function all(iterable = []) {
  if (!iterable || !iterable.length) return Promise.resolve([]);

  return new Promise((resolve, reject) => {
    const result = iterable.map(() => ({ state: 'pending', value: undefined }));
    iterable.forEach((iter, idx) => {
      if (iter instanceof Promise === false) {
        result[idx] = { state: 'fulfilled', value: iter };
        // console.log('1 resolve!!!', iter);
        const isDone = !result.some(v => v.state === 'pending');
        if (isDone) resolve(result.map(v => v.value));
        return;
      }
      
      iter.then(value => {
        result[idx] = { state: 'fulfilled', value };
        // console.log('2 resolve!!!', value);
        const isDone = !result.some(v => v.state === 'pending');
        if (isDone) resolve(result.map(v => v.value));
      }).catch(err => {
        // console.log('reject!!!');
        reject(err)
      });
    });
  });
}
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 1000);
});
all(['hi', p, Promise.resolve(33)])
  .then(values => console.log(values))
  .catch(reason => console.log(reason));
all(['hi', p, Promise.resolve(33), Promise.reject(555)])
  .then(values => console.log(values))
  .catch(reason => console.log(reason));
// const p3 = all([1337, 'hi']).then(values => console.log(values))
//   .catch(reason => console.log(reason));
// console.log(p3);
// setTimeout(() => console.log('the stack is now empty', p3));

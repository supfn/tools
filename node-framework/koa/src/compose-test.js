async function fn1(next) {
  console.log('fn1')
  next && await next()
  console.log('fn1 end')
}

async function fn2(next) {
  console.log('fn2')
  next && await next()
  console.log('fn2 end')
}

async function fn3(next) {
  console.log('fn3')
  next && await next()
  console.log('fn3 end')
}


function compose(middlewares) {
  return () => {
    const dispatch = (i) => {
      let fn = middlewares[i]
      if (!fn) {
        return Promise.resolve()
      }
      const next = () => dispatch(i + 1);
      return Promise.resolve(fn(next));
    }
    return dispatch(0)
  }
}

const middlewares = [fn1, fn2, fn3]
const finalFn = compose(middlewares)
finalFn();

/**
output:

fn1
fn2
fn3
fn3 end
fn2 end
fn1 end
*/
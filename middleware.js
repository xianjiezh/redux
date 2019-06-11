const loggerMiddleware = require('./middlewares/loggerMiddleware')
const timeMiddleware = require('./middlewares/timeMiddleware')
const exceptionMiddleware = require('./middlewares/exceptionMiddleware')

global.log = console.log.bind(console)

let initState = {
  count: 0
}

const applyMiddleware = function (...middlewares) {
  return function rewriteCreateStoreFunc(oldCreateStore) {
    return function newCreateStore(reducer, initState) {
      const store = oldCreateStore(reducer, initState)
      const chain = middlewares.map(middleware => middleware(store))
      let dispatch = store.dispatch 
      chain.reverse().map(middleware => {
        dispatch = middleware(dispatch)
      })
      store.dispatch = dispatch
      return store
    }
  }
}
const createStore = function(reducer, initState, rewriteCreateStoreFunc) {
  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(createStore)
    return newCreateStore(reducer, initState)
  }
  let state = initState 
  let listeners = []
  function subcribe(listener) {
    listeners.push(listener)
  }
  function getState() {
    return state 
  }
  function dispatch(action) {
    state = reducer(state, action) 
    for (let i = 0; i < listeners.length; i ++) {
      listeners[i]()
    }
  }
  // 用一个不匹配任何 type 的 action, 来初始化一个 state 
  dispatch({
    type: Symbol()
  })
  return {
    subcribe, 
    getState,
    dispatch,
  }
}
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware);

function counterReducer(state = initState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count - 1
      }
    default: 
      return state
  }
}
const store = createStore(counterReducer, initState, rewriteCreateStoreFunc);

const next = store.dispatch

const logger = loggerMiddleware(store)
const exception = exceptionMiddleware(store)
const time = timeMiddleware(store)


// 重写 store.dispatch
store.dispatch = exception(time(logger(next)))

store.dispatch({
  type: 'INCREMENT'
})


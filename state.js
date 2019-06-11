let initState = {
  count: 0
}
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

const createStore = function(reducer, initState) {
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

const store = createStore(counterReducer)

console.log(store.getState())
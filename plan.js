const log = console.log.bind(console)

const createStore = function(reducer, initState) {
  let state = initState 
  let listeners = []
  function subscribe(listener) {
    listeners.push(listener)
  }
  function dispatch(action) {
    state = reducer(state, action)
    listeners.forEach(listener => {
      listener()
    })
  }
  function getState() {
    return state 
  }
  return {
    subscribe,
    dispatch,
    getState,
  }
}

let initState = {
  count: 0
}

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': 
      return {
        ...state,
        count: state.count - 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count + 1
      }
    default: 
      return state
  }
}

let store = createStore(reducer, initState)
store.subscribe(() => {
  let state = store.getState() 
  log(state.count)
})

store.dispatch({
  type: 'INCREMENT',
})
store.dispatch({
  type: 'DECREMENT'
})
store.dispatch({
  count: 'abc'
})
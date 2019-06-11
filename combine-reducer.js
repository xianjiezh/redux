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

function counterReducer(state, action) {
  // 接收的 state 是 state.counter
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count -1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count -1
      }
    default: 
      return state 
  }
}

function InfoReducer(state, action) {
  // 接收的 state 是 state.info
  switch (action.type) {
    case 'SET_NAME': 
      return {
        ...state,
        name: action.name
      }
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description
      }
    default: 
      return state 
  }
}

const reducer = combineReducers({
  counter: counterReducer,
  info: InfoReducer
})

function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  return function(state = {}, action) {
    let newReducers = {}
    reducerKeys.forEach(key => {
      const reducer = reducers[key]
      const newState = reducer(state[key], action)
      newReducers[key] = newState
    })
    return newReducers
  }
}

let initState = {
  counter: {
    count: 0
  },
  info: {
    name: 'han',
    description: 'front end'
  }
}

let store = createStore(reducer, initState)
store.subscribe(() => {
  let state = store.getState()
  log(state.counter.count, state.info.name, state.info.description)
})

store.dispatch({
  type: 'INCREMENT'
})
store.dispatch({
  type: 'SET_NAME',
  name: 'lalala'
})
store.dispatch({
  type: 'SET_DESCRIPTION',
  description: 'full stack'
})

// 每个 reducer 里面都会执行一遍...
// 好坑 
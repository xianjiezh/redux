const log = console.log.bind(console)

const createStore = (reducer, initState) => {
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
  dispatch({type: Symbol()})
  return {
    subscribe, 
    dispatch, 
    getState,
  }
}

function infoReducer(state, action) {
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

function combineReducer(reducers) {
  const reducerKeys = Object.keys(reducers)
  return function(state = {}, action) {
    const nextState = {}
    reducerKeys.forEach(key => {
      const reducer = reducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
    })
    return nextState
  }
}

const reducer = combineReducer({
  counter: counterReducer,
  info: infoReducer,
})

let initState = {
  count: 0
}

function counterReducer(state, action) {
  if (!state) {
    state = initState
  }
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    default:
      return state
  }
}

const store = createStore(reducer)

const next = store.dispatch

store.dispatch = action => {
  try {
    next(action)
  } catch (err) {
    console.error('错误报告: ', err)
  }
}

store.dispatch({
  type: 'INCREMENT'
})
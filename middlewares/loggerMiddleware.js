const loggerMiddleware = store => {
  return next => {
    return action => {
      log('this state', store.getState())
      log('action', action)
      next(action)
      log('next state', store.getState())
    }
  }
}
module.exports = loggerMiddleware
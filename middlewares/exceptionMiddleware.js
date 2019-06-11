const exceptionMiddleware = store => {
  return next => {
    return action => {
      try {
        next(action)
      } catch (err) {
        log('error: ', err)
      }
    }
  }
}


module.exports = exceptionMiddleware
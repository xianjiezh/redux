

const timeMiddleware = store => next => action => {
  log('time', new Date().getTime())
  next(action)
}

module.exports = timeMiddleware


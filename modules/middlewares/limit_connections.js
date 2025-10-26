const connections = []
const limitConnections = (limit) => {
  return (socket, next) => {
    if (!limit || connections.length < limit) return next()
    const err = new Error("Connection refused: Limit exceeded")
    return next(err)
  }
}

export default limitConnections
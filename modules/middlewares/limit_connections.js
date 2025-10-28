import SocketController from "../socket/socket_controller.js"

const limitConnections = (limit) => {
  return (socket, next) => {
    if (!limit || SocketController.connections.length < limit) {
      SocketController.connections.push(socket.id)
      return next()
    }
    const err = new Error("Connection refused: Limit exceeded")
    return next(err)
  }
}

export default limitConnections
import limitConnections from "../middlewares/limit_connections.js"
import SocketController from "./socket_controller.js"

const socketHandler = (io) => {
  io.use(limitConnections(1))
  io.on("connection", SocketController.onConnection)
  // TODO: handle vol control
  // TODO: handle disconnect
}

export default socketHandler
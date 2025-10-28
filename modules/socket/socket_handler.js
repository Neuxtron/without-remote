import limitConnections from "../middlewares/limit_connections.js"
import SocketController from "./socket_controller.js"

const socketHandler = (io) => {
  io.use(limitConnections(1))
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("vol_up", SocketController.onVolUp)
    socket.on("vol_down", SocketController.onVolDown)
    
    socket.on("arrow_up", SocketController.onArrowUp)
    socket.on("arrow_down", SocketController.onArrowDown)
    socket.on("arrow_left", SocketController.onArrowLeft)
    socket.on("arrow_fast_left", SocketController.onArrowFastLeft)
    socket.on("arrow_right", SocketController.onArrowRight)
    socket.on("arrow_fast_right", SocketController.onArrowFastRight)

    socket.on("disconnect", SocketController.onDisconnect(socket.id))
  })
}

export default socketHandler
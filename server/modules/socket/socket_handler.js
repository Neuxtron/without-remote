import limitConnections from "../middlewares/limit_connections.js"
import SocketController from "./socket_controller.js"

const socketHandler = (io) => {
  io.use(limitConnections(1))
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    //-------/ Volume /-------/
    socket.on("vol_up", SocketController.onVolUp)
    socket.on("vol_down", SocketController.onVolDown)
    
    //-------/ Arrows /-------/
    socket.on("arrow_up", SocketController.onArrowUp)
    socket.on("arrow_down", SocketController.onArrowDown)
    socket.on("arrow_left", SocketController.onArrowLeft)
    socket.on("arrow_fast_left", SocketController.onArrowFastLeft)
    socket.on("arrow_right", SocketController.onArrowRight)
    socket.on("arrow_fast_right", SocketController.onArrowFastRight)

    //-------/ Other Keyboards /-------/
    socket.on("space", SocketController.onSpace)
    socket.on("return", SocketController.onReturn)
    
    //-------/ Special /-------/
    socket.on("play_pause", SocketController.onPlayPause)
    socket.on("back", SocketController.onBack)

    socket.on("disconnect", SocketController.onDisconnect(socket.id))
  })
}

export default socketHandler
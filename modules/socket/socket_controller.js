class SocketController {
  static onConnection = (socket) => {
    console.log("Client connected:", socket.id);
  }
}

export default SocketController
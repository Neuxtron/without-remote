import { createServer } from "http"
import { Server } from "socket.io"
import pico from "picocolors"
import socketHandler from "./modules/socket/socket_handler.js"

const server = createServer()
const io  = new Server(server, {
  cors: { origin: "*" }
})

socketHandler(io)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(pico.cyan(`
    
  Server running on http://localhost:${PORT}
    
  `))
})
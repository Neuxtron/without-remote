import { createServer } from "http"
import { Server } from "socket.io"
import pico from "picocolors"
import socketHandler from "./modules/socket/socket_handler.js"
import getLocalIP from "./utils/get_local_ip.js"

const server = createServer()
const io  = new Server(server, {
  cors: { origin: "*" }
})

socketHandler(io)
const networkAddresses = getLocalIP().map((net) => {
  return `${pico.white(net[1])}\t${pico.gray(`(${net[0]})`)}`
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log(pico.gray(`
  
  Server running on port ${PORT} on addresses:
    ${networkAddresses.join("\n    ")}

`))
})
# Without Remote

[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)]()

A lightweight Socket.IO server that turns your PC into a remotely controllable media machine. Without Remote receives events from the companion mobile app and translates them into OS-level keyboard presses and system volume changes — navigate videos, browse files, and control playback from your phone over your local network.

This server is the PC half of the **Without Remote** system. It pairs with the mobile client:

> **Client:** [Neuxtron/without-remote-client](https://github.com/Neuxtron/without-remote-client) — a Flutter app that sends gesture events over Socket.IO.

---

## Features

- **Low-latency WebSocket control** — Socket.IO server listening on port `3000`, open to any LAN client.
- **OS-level keyboard emulation** — arrow keys, space, return, media play/pause, and Alt+Left (back), powered by [`@nut-tree-fork/nut-js`](https://github.com/nut-tree/nut.js).
- **System volume control** — raise/lower the master volume in steps of 5 via [`loudness`](https://www.npmjs.com/package/loudness).
- **Single-client lock** — a connection-limit middleware allows only one connected client at a time; extra connections are refused.
- **LAN address printout** — on startup, lists all local IPv4 addresses so you know exactly what to type into the client app.
- **Cross-platform** — works on Windows, macOS, and Linux.

---

## Event Reference

The server listens for these Socket.IO events and maps each to an action on the host machine:

### Volume

| Event      | Action              |
| ---------- | ------------------- |
| `vol_up`   | System volume **+5** |
| `vol_down` | System volume **−5** |

### Arrows

| Event              | Action          |
| ------------------ | --------------- |
| `arrow_up`         | `↑`             |
| `arrow_down`       | `↓`             |
| `arrow_left`       | `←`             |
| `arrow_fast_left`  | `←` ×2 (double) |
| `arrow_right`      | `→`             |
| `arrow_fast_right` | `→` ×2 (double) |

### Other Keys

| Event    | Action           |
| -------- | ---------------- |
| `space`  | `Space`          |
| `return` | `Return` (Enter) |

### Special

| Event        | Action                  |
| ------------ | ----------------------- |
| `play_pause` | Media play/pause key    |
| `back`       | `Alt + ←` (browser back) |

---

## Architecture

```
┌──────────────────────┐   Socket.IO (WebSocket, port 3000)   ┌─────────────┐
│  without-remote-     │ ───────────────────────────────────► │  This server│
│  client (Flutter)    │   vol_up, arrow_left, space, ...     │  (on PC)    │
└──────────────────────┘                                      └─────────────┘
                                                                       │
                                                                       ▼
                                                  ┌────────────────────────────┐
                                                  │  nut.js → keyboard presses │
                                                  │  loudness → system volume  │
                                                  └────────────────────────────┘
```

Incoming connections pass through the `limitConnections(1)` middleware — the first client to connect holds the session, and any additional connection attempt is rejected with `Connection refused: Limit exceeded` until the current client disconnects.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or later recommended)
- The companion client app — see [Neuxtron/without-remote-client](https://github.com/Neuxtron/without-remote-client)
- Phone and PC on the same local network

### Installation

```bash
git clone https://github.com/Neuxtron/without-remote.git
cd without-remote
npm install
```

### Running

```bash
node .
```

Or with auto-restart during development (requires `nodemon` installed globally):

```bash
npm run dev
```

To use a port other than `3000`, set the `PORT` environment variable:

```bash
PORT=8080 node .
```

On startup, the server prints its LAN addresses:

```
Server running on port 3000 on addresses:
    192.168.1.10    (eth0)
```

Enter that IP (e.g. `192.168.1.10`) in the client app's settings dialog to connect.

> **Note:** This server has open CORS (`origin: "*"`) and no authentication — it is designed for use on trusted local networks only.

---

## Project Structure

```
index.js                            # Entry point: HTTP + Socket.IO server setup
modules/
├── middlewares/
│   └── limit_connections.js        # Socket.IO middleware: caps concurrent clients
└── socket/
    ├── socket_handler.js           # Wires socket events to controller actions
    └── socket_controller.js        # Keyboard & volume action implementations
utils/
    └── get_local_ip.js             # Collects non-internal IPv4 addresses
```

---

## Tech Stack

| Package                                                          | Purpose                          |
| ---------------------------------------------------------------- | -------------------------------- |
| [`socket.io`](https://socket.io)                                 | WebSocket server                 |
| [`@nut-tree-fork/nut-js`](https://github.com/nut-tree/nut.js)    | OS-level keyboard emulation      |
| [`loudness`](https://www.npmjs.com/package/loudness)             | System volume control            |
| [`picocolors`](https://github.com/alexeyraspopov/picocolors)     | Terminal output styling          |

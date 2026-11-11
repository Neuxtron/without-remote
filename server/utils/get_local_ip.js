import os from "os";

function getLocalIP() {
  const nets = os.networkInterfaces();
  let results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (localhost) and non-IPv4
      if (net.family === "IPv4" && !net.internal) {
        results.push([name, net.address]);
      }
    }
  }

  return results;
}

export default getLocalIP
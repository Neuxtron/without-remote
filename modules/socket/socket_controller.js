import { Key, keyboard } from "@nut-tree-fork/nut-js";
import loudness from "loudness";

class SocketController {
  static connections = []
  
  static onDisconnect = (socketId) => {
    return () => {
      this.connections = this.connections.filter((e) => e !== socketId)
      console.log("Client disconnected:", socketId);
    }
  }

  static onVolUp = async () => {
    const vol = (await loudness.getVolume()) + 5
    await loudness.setVolume(vol)
  }
  static onVolDown = async () => {
    const vol = (await loudness.getVolume()) - 5
    await loudness.setVolume(vol)
  }

  static onArrowUp = () => {
    keyboard.type(Key.Up)
  }
  static onArrowDown = () => {
    keyboard.type(Key.Down)
  }
  static onArrowLeft = () => {
    keyboard.type(Key.Left)
  }
  static onArrowFastLeft = () => {
    keyboard.type(Key.Left)
    keyboard.type(Key.Left)
  }
  static onArrowRight = () => {
    keyboard.type(Key.Right)
  }
  static onArrowFastRight = () => {
    keyboard.type(Key.Right)
    keyboard.type(Key.Right)
  }

  static onPlayPause = () => {
    keyboard.type(Key.AudioPlay)
  }

  static onSpace = () => {
    keyboard.type(Key.Space)
  }
}

export default SocketController
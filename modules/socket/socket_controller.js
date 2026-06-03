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

  //-------/ Volume /-------/
  static onVolUp = async () => {
    const vol = (await loudness.getVolume()) + 5
    await loudness.setVolume(vol)
  }
  static onVolDown = async () => {
    const vol = (await loudness.getVolume()) - 5
    await loudness.setVolume(vol)
  }

  //-------/ Arrows /-------/
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

  //-------/ Other Keyboards /-------/
  static onSpace = () => {
    keyboard.type(Key.Space)
  }
  static onReturn = () => {
    keyboard.type(Key.Return)
  }

  //-------/ Special /-------/
  static onPlayPause = () => {
    keyboard.type(Key.AudioPlay)
  }
  static onBack = async () => {
    keyboard.type(Key.LeftAlt, Key.Left)
  }
}

export default SocketController
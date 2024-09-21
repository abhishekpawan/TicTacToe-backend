import { WebSocketServer } from "ws";
import {
  handlePlayerJoin,
  handlePlayerMove,
  handleGameResult,
} from "../controllers/gameController.js";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("A new player connected.");

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    console.log("Received:", parsedMessage);

    switch (parsedMessage.type) {
      case "join":
        handlePlayerJoin(ws, parsedMessage.player);
        break;
      case "move":
        handlePlayerMove(ws, parsedMessage.move);
        break;
      case "result":
        handleGameResult(ws, parsedMessage.result);
        break;
      default:
        console.log("Unknown message type:", parsedMessage.type);
    }
  });

  ws.on("close", () => {
    console.log("A player disconnected.");
  });
});

export default wss;

import { addPlayerToRoom, createGameRoom } from "../models/gameModel.js";

let waitingPlayer = null;

export const matchPlayerToRoom = (ws, playerDetails) => {
  if (waitingPlayer === null) {
    // No player waiting, create a new room and set this player as waiting
    const roomId = createGameRoom();
    waitingPlayer = { ws, playerDetails, roomId };
    return { roomId };
  } else {
    // Found an opponent, join the same room
    const opponent = waitingPlayer;
    waitingPlayer = null; // Reset the waiting player
    addPlayerToRoom(opponent.roomId, ws, playerDetails);
    return { roomId: opponent.roomId, opponent };
  }
};

import { matchPlayerToRoom } from "../services/matchmakingService.js";
import { updateGameState } from "../models/gameModel.js";

// Handle when a player joins the game
export function handlePlayerJoin(ws, playerDetails) {
  const { roomId, opponent } = matchPlayerToRoom(ws, playerDetails);
  if (opponent) {
    const gameStartMessage = {
      type: "start",
      gameId: `${playerDetails[0].name}_${playerDetails[1].name}`,
      players: playerDetails,
    };
    ws.send(JSON.stringify(gameStartMessage));
    opponent.ws.send(JSON.stringify(gameStartMessage));
  } else {
    ws.send(JSON.stringify({ type: "waiting", roomId }));
  }
}

// Handle player moves
export function handlePlayerMove(data) {
  const { gameId, move } = data;
  const updatedGameState = updateGameState(gameId, move);

  // Notify both players of the move and new game state
}

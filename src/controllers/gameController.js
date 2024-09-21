const activeRooms = new Map(); // Stores rooms with gameId and players

// Function to handle player joining the game
export function handlePlayerJoin(ws, playerDetails) {
  let roomId = null;

  // Look for an available room with just one player
  for (const [id, room] of activeRooms) {
    if (room.players.length === 1) {
      roomId = id;
      room.players.push({ ws, playerDetails });
      break;
    }
  }

  // If no room is available, create a new room
  if (!roomId) {
    roomId = `${playerDetails.name}_${Date.now()}`; // Unique room ID
    activeRooms.set(roomId, { players: [{ ws, playerDetails }], state: {} });

    // Notify the player that the room is created but waiting for an opponent
    ws.send(JSON.stringify({ type: "join", gameId: roomId }));
  } else {
    // A second player has joined the room, start the game
    const room = activeRooms.get(roomId);
    const [player1, player2] = room.players;

    // Notify both players that the game is starting
    const gameStartMessageForPlayer1 = {
      type: "start",
      opponent: player2.playerDetails,
      gameId: roomId,
    };
    const gameStartMessageForPlayer2 = {
      type: "start",
      opponent: player1.playerDetails,
      gameId: roomId,
    };

    player1.ws.send(JSON.stringify(gameStartMessageForPlayer1));
    player2.ws.send(JSON.stringify(gameStartMessageForPlayer2));
  }
}

// Update the entire game state when a player makes a move and broadcast to both players
export function handlePlayerMove(ws, moveDetails) {
  const { gameId, newGameState } = moveDetails;
  console.log(gameId, newGameState);
  // Find the active room for this gameId
  const room = activeRooms.get(gameId);
  if (!room) {
    ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
    return;
  }

  // Replace the old game state with the new one
  room.state.board = newGameState;

  // Send updated game state to both players
  const gameUpdateMessage = {
    type: "update",
    gameId,
    board: newGameState,
  };

  // Notify both players of the updated game state
  room.players.forEach((player) => {
    player.ws.send(JSON.stringify(gameUpdateMessage));
  });
}

// Handle the game result and delete the active room
export function handleGameResult(ws, resultDetails) {
  const { gameId } = resultDetails; // Only need the gameId to delete the room

  // Find the active room for this gameId
  const room = activeRooms.get(gameId);
  if (!room) {
    ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
    return;
  }

  // Delete the active room after the game is over
  activeRooms.delete(gameId);
  console.log(`Room ${gameId} has been deleted after the game ended.`);
}

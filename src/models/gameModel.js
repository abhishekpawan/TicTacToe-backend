const games = {}; // Store active game rooms
const gameRooms = {}; // Store details of players in each room

export const createGameRoom = () => {
  const roomId = generateRoomId();
  gameRooms[roomId] = { players: [], gameState: {} };
  return roomId;
};

export const addPlayerToRoom = (roomId, ws, playerDetails) => {
  if (!gameRooms[roomId]) {
    gameRooms[roomId] = { players: [], gameState: {} };
  }
  gameRooms[roomId].players.push({ ws, playerDetails });
};

export const updateGameState = (roomId, move) => {
  const game = gameRooms[roomId];
  if (game) {
    // Update the game state based on the move
    game.gameState = { ...game.gameState, move };
    return game.gameState;
  }
  return null;
};

export const getGameRoom = (roomId) => gameRooms[roomId];

export const destroyGameRoom = (roomId) => {
  delete gameRooms[roomId];
};

const generateRoomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

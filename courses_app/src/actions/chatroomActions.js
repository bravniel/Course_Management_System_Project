export const addMessageAction = (message) => ({
  type: "ADD_MESSAGE",
  message,
});

export const removeMessageAction = (index) => ({
  type: "REMOVE_MESSAGE",
  index,
});

export const initRoomAction = (roomData) => ({
  type: "INIT",
  roomData,
});

const roomsReducer = (rooms, action) => {
  switch (action.type) {
    case "ADD_ROOM":
      return rooms.concat(action.room);
    case "SET_ROOMS":
      return [...action.rooms];
    default:
      return [...rooms];
  }
};

export default roomsReducer;

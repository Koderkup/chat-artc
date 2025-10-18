import React, { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

const Join: React.FC = () => {
  const ws = useContext(RoomContext);

  const createRoom = () => {
     console.log("Emitting join-room");
    ws?.emit("create-room");
  };

  return (
    <button
      className="bg-rose-400 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg m-auto"
      onClick={createRoom}
    >
      Start new meeting
    </button>
  );
};


export default Join;

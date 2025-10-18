import React, { createContext, useEffect, useState } from "react";
import socketIOClient, { io, Socket } from "socket.io-client";


export const RoomContext = createContext<Socket | null>(null);
const WS = process.env.REACT_APP_WS;
const ws = socketIOClient(WS);
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const enterRoom = ({ roomId }: { roomId: string }) => {console.log({roomId})
};
  useEffect(() => {
    ws?.on("room-created", enterRoom);
  }, []);

  return <RoomContext.Provider value={ws}>{children}</RoomContext.Provider>;
};

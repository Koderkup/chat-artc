import React, { createContext, useEffect, useState } from 'react'
import socketIOClient, { io, Socket } from "socket.io-client";

// const WS = "http://localhost:8080";
export const RoomContext = createContext<Socket | null>(null);
const WS = process.env.REACT_APP_WS;
const ws = socketIOClient(WS);


export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ws, setWs] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(WS);
    setWs(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return <RoomContext.Provider value={ws}>{children}</RoomContext.Provider>;
};



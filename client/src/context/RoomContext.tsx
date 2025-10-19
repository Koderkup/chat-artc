import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient, { io, Socket } from "socket.io-client";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";


export const RoomContext = createContext<Socket | null>(null);
const WS = process.env.REACT_APP_WS;
const ws = socketIOClient(WS);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);
    ws?.on("room-created", enterRoom);
  }, []);

  return <RoomContext.Provider value={ws}>{children}</RoomContext.Provider>;
};

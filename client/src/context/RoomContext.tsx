import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient, { Socket } from "socket.io-client";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";

interface RoomContextType {
  ws: Socket;
  me: Peer | undefined;
  stream: MediaStream | undefined;
  isStreamLoading: boolean;
  streamError: string | null;
  requestMediaAccess: () => Promise<void>;
}

export const RoomContext = createContext<RoomContextType | null>(null);
const WS = process.env.REACT_APP_WS;
const ws = socketIOClient(WS);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [isStreamLoading, setIsStreamLoading] = useState(false); // Начинаем с false
  const [streamError, setStreamError] = useState<string | null>(null);

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log(participants);
  };

  // Функция для запроса доступа к медиа
  const requestMediaAccess = async () => {
    try {
      setIsStreamLoading(true);
      setStreamError(null);

      // Останавливаем предыдущий stream если есть
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      setStream(mediaStream);
      setIsStreamLoading(false);
    } catch (error: any) {
      console.error("Error accessing media devices:", error);
      setIsStreamLoading(false);

      if (error.name === "NotAllowedError") {
        setStreamError(
          "Разрешение не предоставлено: Пожалуйста, разрешите доступ к камере и микрофону"
        );
      } else if (error.name === "NotFoundError") {
        setStreamError("Камера или микрофон не найдены");
      } else if (error.name === "NotSupportedError") {
        setStreamError("Браузер не поддерживает камеру/микрофон");
      } else {
        setStreamError("Не удалось получить доступ к камере и микрофону");
      }
    }
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);

    // Не запрашиваем медиа автоматически, ждем действия пользователя
    // requestMediaAccess();

    ws?.on("room-created", enterRoom);
    ws?.on("get-users", getUsers);

    return () => {
      // Останавливаем все треки при размонтировании
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      ws?.off("room-created", enterRoom);
      ws?.off("get-users", getUsers);
    };
  }, []);

  return (
    <RoomContext.Provider
      value={{
        ws,
        me,
        stream,
        isStreamLoading,
        streamError,
        requestMediaAccess,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

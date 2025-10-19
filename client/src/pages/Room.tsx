import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";

const Room = () => {
  const { id } = useParams();
  const context = useContext(RoomContext);

  useEffect(() => {
    if (context?.ws && id && context.me?.id) {
      context.ws.emit("join-room", { roomId: id, peerId: context.me.id });
    }
  }, [id, context]);

  if (!context) {
    return <div>Загрузка...</div>;
  }

  // Если нет stream и нет ошибки - показываем кнопку для запроса доступа
  if (!context.stream && !context.streamError && !context.isStreamLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Комната: {id}</h2>
        <p>
          Для участия в видеоконференции необходимо предоставить доступ к камере
          и микрофону
        </p>
        <button
          onClick={context.requestMediaAccess}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Разрешить доступ к камере и микрофону
        </button>
      </div>
    );
  }

  if (context.isStreamLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>Запрос доступа к камере и микрофону...</div>
        <div>
          Пожалуйста, разрешите доступ когда браузер запросит разрешение
        </div>
      </div>
    );
  }

  if (context.streamError) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Комната: {id}</h2>
        <div style={{ color: "red", margin: "10px 0" }}>
          Ошибка: {context.streamError}
        </div>
        <button
          onClick={context.requestMediaAccess}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Комната: {id}</h2>
      <div>{context.stream && <VideoPlayer stream={context.stream} />}</div>
    </div>
  );
};

export default Room;

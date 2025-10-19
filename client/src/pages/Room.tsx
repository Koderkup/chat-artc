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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  // Если нет stream и нет ошибки - показываем кнопку для запроса доступа
  if (!context.stream && !context.streamError && !context.isStreamLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Комната: {id}</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Для участия в видеоконференции необходимо предоставить доступ к камере
          и микрофону
        </p>
        <button
          onClick={context.requestMediaAccess}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Разрешить доступ к камере и микрофону
        </button>
      </div>
    );
  }

  if (context.isStreamLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-lg font-medium mb-2">
          Запрос доступа к камере и микрофону...
        </div>
        <div className="text-gray-600">
          Пожалуйста, разрешите доступ когда браузер запросит разрешение
        </div>
      </div>
    );
  }

  if (context.streamError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Комната: {id}</h2>
        <div className="text-red-600 mb-6 max-w-md">
          Ошибка: {context.streamError}
        </div>
        <button
          onClick={context.requestMediaAccess}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Комната: {id}</h2>
      <div className="flex justify-center">
        {context.stream && <VideoPlayer stream={context.stream} />}
      </div>
    </div>
  );
};

export default Room;

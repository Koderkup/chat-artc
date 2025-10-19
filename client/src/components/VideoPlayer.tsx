import React, { useEffect, useRef } from "react";

const VideoPlayer: React.FC<{ stream: MediaStream | undefined }> = ({
  stream,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return <div>No video stream available</div>;
  }

  return <video ref={videoRef} autoPlay  />;
};

export default VideoPlayer;

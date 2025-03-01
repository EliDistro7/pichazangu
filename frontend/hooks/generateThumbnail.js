

import { useState, useEffect } from 'react';

function generateThumbnail(videoUrl, snapshotTime = 2) {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.currentTime = snapshotTime;

    const canvas = document.createElement('canvas');
    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL('image/png'));
    });
  }, [videoUrl, snapshotTime]);

  return thumbnail;
}

export default generateThumbnail;

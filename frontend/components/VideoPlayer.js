
'use client'
import { useState, useRef, useEffect } from "react";
import { Download, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from "lucide-react";

const VideoPlayer = ({ 
  src, 
  caption, 
  onDownload, 
  autoPlay = false, 
  controls = true,
  index,
  totalItems
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Format time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle video metadata load
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  // Handle time update during playback
  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const percent = (current / videoRef.current.duration) * 100;
    setCurrentTime(current);
    setProgress(percent);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Seek to position in video
  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const pos = (e.nativeEvent.offsetX / progressBar.offsetWidth);
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle auto-hide controls
  useEffect(() => {
    const showControls = () => {
      setControlsVisible(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      if (isHovering) {
        controlsTimeoutRef.current = setTimeout(() => {
          setControlsVisible(false);
        }, 3000);
      }
    };

    showControls();
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isHovering]);

  // Skip backward 10 seconds
  const skipBackward = () => {
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={() => {
        setIsHovering(true);
        setControlsVisible(true);
        
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        
        controlsTimeoutRef.current = setTimeout(() => {
          if (!isPlaying) return;
          setControlsVisible(false);
        }, 3000);
      }}
    >
      {/* Position indicator */}
      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
        {index + 1}/{totalItems}
      </div>
      
      {/* Download button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDownload(src, `video-${index}.mp4`);
        }}
        className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/80 text-white rounded-full z-10 transition-all"
        title="Download"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto max-h-[80vh] object-contain"
        autoPlay={autoPlay}
        muted={isMuted}
        loop
        playsInline
        onClick={togglePlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Play/Pause overlay button (large center) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying && !isHovering ? 'opacity-0' : 'opacity-100'}`}
        onClick={togglePlay}
      >
        <button className="bg-black/40 hover:bg-black/60 rounded-full p-4 transition-all transform hover:scale-110">
          {isPlaying ? 
            <Pause className="w-8 h-8 text-white" /> : 
            <Play className="w-8 h-8 text-white" />
          }
        </button>
      </div>

      {/* Video Controls */}
      {controls && (
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 ${controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress bar */}
          <div 
            className="w-full h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-red-600 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white hover:text-gray-300">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              {/* Skip backward/forward */}
              <button onClick={skipBackward} className="text-white hover:text-gray-300">
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button onClick={skipForward} className="text-white hover:text-gray-300">
                <SkipForward className="w-5 h-5" />
              </button>
              
              {/* Volume */}
              <button onClick={toggleMute} className="text-white hover:text-gray-300">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              {/* Time display */}
              <div className="text-white text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Fullscreen toggle */}
              <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Caption (if provided) */}
      {caption && (
        <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-sm text-white font-medium line-clamp-2">{caption}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
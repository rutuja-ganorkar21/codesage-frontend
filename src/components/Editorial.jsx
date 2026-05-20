import { useState, useRef, useEffect } from "react";
import { Pause, Play, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from "lucide-react";

// ── Video Player ─────────────────────────────────────────────────────────────
const VideoPlayer = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) { video.pause(); } else { video.play(); }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolume = (e) => {
    const val = Number(e.target.value);
    if (videoRef.current) videoRef.current.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) videoRef.current.currentTime = val;
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoDuration, videoRef.current.currentTime + 10);
    }
  };

  const handlePlaybackRate = (rate) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setVideoDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const progress = videoDuration ? (currentTime / videoDuration) * 100 : 0;
  const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", width: "100%",
        maxWidth: "520px",    
        margin: "0 auto",  
        borderRadius: "12px", overflow: "hidden",
        background: "#000", border: "1px solid #1e293b",
        marginBottom: "8px",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        style={{
          width: "100%", aspectRatio: "16/9",
          display: "block", cursor: "pointer", background: "#000",
        }}
      />

      {/* Center Play indicator */}
      {!isPlaying && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: "rgba(99,102,241,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Play size={26} color="#fff" fill="#fff" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
        padding: "32px 14px 12px",
        opacity: isHovering || !isPlaying ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}>
        {/* Progress bar */}
        <div style={{ marginBottom: "10px", position: "relative" }}>
          <div style={{
            position: "absolute", top: "50%", left: 0,
            transform: "translateY(-50%)",
            width: `${progress}%`, height: "4px",
            background: "#6366f1", borderRadius: "999px",
            pointerEvents: "none", zIndex: 1,
          }} />
          <input
            type="range" min="0" max={videoDuration || 0} value={currentTime}
            onChange={handleSeek}
            style={{
              width: "100%", height: "4px", appearance: "none",
              background: `rgba(255,255,255,0.2)`,
              borderRadius: "999px", cursor: "pointer",
              outline: "none", position: "relative", zIndex: 2,
            }}
          />
        </div>

        {/* Bottom controls */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "8px",
        }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Rewind */}
            <button onClick={handleRewind} style={iconBtnStyle}>
              <RotateCcw size={14} color="#fff" />
            </button>

            {/* Play/Pause */}
            <button onClick={togglePlayPause} style={{
              ...iconBtnStyle,
              background: "#6366f1", width: "32px", height: "32px",
            }}>
              {isPlaying
                ? <Pause size={14} color="#fff" fill="#fff" />
                : <Play size={14} color="#fff" fill="#fff" />
              }
            </button>

            {/* Forward */}
            <button onClick={handleForward} style={iconBtnStyle}>
              <RotateCw size={14} color="#fff" />
            </button>

            {/* Mute + Volume */}
            <button onClick={toggleMute} style={iconBtnStyle}>
              {isMuted || volume === 0
                ? <VolumeX size={14} color="#fff" />
                : <Volume2 size={14} color="#fff" />
              }
            </button>
            <input
              type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
              onChange={handleVolume}
              style={{
                width: "60px", height: "3px", appearance: "none",
                background: `linear-gradient(to right, #6366f1 ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%)`,
                borderRadius: "999px", cursor: "pointer", outline: "none",
              }}
            />

            {/* Time */}
            <span style={{
              fontSize: "11px", color: "#e2e8f0",
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: "nowrap",
            }}>
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </span>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Playback Rate */}
            <div style={{ position: "relative" }}>
              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRate(Number(e.target.value))}
                style={{
                  background: "rgba(0,0,0,0.6)", color: "#e2e8f0",
                  border: "1px solid #334155", borderRadius: "6px",
                  padding: "3px 6px", fontSize: "11px", cursor: "pointer",
                  outline: "none",
                }}
              >
                {rates.map((r) => (
                  <option key={r} value={r}>{r}x</option>
                ))}
              </select>
            </div>

            {/* Fullscreen */}
            <button onClick={handleFullscreen} style={iconBtnStyle}>
              <Maximize size={14} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const iconBtnStyle = {
  width: "28px", height: "28px", borderRadius: "6px",
  background: "rgba(255,255,255,0.1)", border: "none",
  cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center",
  flexShrink: 0, transition: "background 0.15s",
};

// ── Editorial Component ──────────────────────────────────────────────────────
const Editorial = ({ problem }) => {
  const video = problem?.vedios?.[0];

  return (
    <div style={{ marginTop: "8px" }}>

      {/* ── Theory / Editorial Text FIRST ── */}
      {problem?.editorial ? (
        <div style={{
          background: "#0f172a", borderRadius: "12px",
          padding: "20px 24px", border: "1px solid #1e293b",
          marginBottom: "24px",
        }}>
          <div style={{
            fontSize: "13px", fontWeight: 700, color: "#6366f1",
            letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="#6366f1"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Editorial
          </div>
          <div style={{
            color: "#94a3b8", fontSize: "14px",
            lineHeight: "1.9", whiteSpace: "pre-wrap",
          }}>
            {problem.editorial}
          </div>
        </div>
      ) : (
        <div style={{
          color: "#64748b", textAlign: "center",
          padding: "32px", marginBottom: "24px",
          background: "#0f172a", borderRadius: "12px",
          border: "1px solid #1e293b",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📝</div>
          <div style={{ fontWeight: 600, color: "#475569", fontSize: "13px" }}>
            No editorial available yet.
          </div>
        </div>
      )}

      {/* ── Video Solution SECOND ── */}
      <div style={{
        fontSize: "13px", fontWeight: 700, color: "#34d399",
        letterSpacing: "0.06em", textTransform: "uppercase",
        marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px",
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
          viewBox="0 0 24 24" fill="none" stroke="#34d399"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
        Video Solution
      </div>

      {video?.secureUrl ? (
        <VideoPlayer
          secureUrl={video.secureUrl}
          thumbnailUrl={video.thumbnailUrl}
          duration={video.duration}
        />
      ) : (
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: "10px", padding: "24px",
          display: "flex", alignItems: "center", gap: "12px",
          color: "#475569", fontSize: "13px",
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
            viewBox="0 0 24 24" fill="none" stroke="#475569"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          No solution video available yet.
        </div>
      )}
    </div>
  );
};

export default Editorial;
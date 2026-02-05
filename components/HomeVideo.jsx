"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { homeVideosAPI } from "@/lib/api";

function HomeVideoComponent() {
  const [video, setVideo] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHomePage, setIsHomePage] = useState(false);
  const videoRef = useRef(null);
  const pathname = usePathname();

  // Check if we're on the homepage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = pathname || window.location.pathname;
      const isHome = path === '/' || path === '';
      setIsHomePage(isHome);
      
      // If not on homepage, pause video if playing
      if (!isHome && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [pathname]);

  useEffect(() => {
    const fetchActiveVideo = async () => {
      // Only fetch video if we're on homepage
      if (!isHomePage) {
        return;
      }
      
      try {
        const response = await homeVideosAPI.getActive();
        
        // Handle different response structures
        let videoData = null;
        if (response.data) {
          // If response.data is an array, find the latest active video
          if (Array.isArray(response.data)) {
            // Filter active videos and sort by uploadedAt (newest first)
            const activeVideos = response.data
              .filter(v => v.isActive === true)
              .sort((a, b) => {
                const dateA = new Date(a.uploadedAt || a.createdAt || 0);
                const dateB = new Date(b.uploadedAt || b.createdAt || 0);
                return dateB - dateA; // Newest first
              });
            
            if (activeVideos.length > 0) {
              videoData = activeVideos[0]; // Get the latest one
            }
          }
          // Check nested structure: response.data.data (single object)
          else if (response.data.data) {
            videoData = response.data.data;
          } 
          // Check direct structure: response.data (if backend returns { data: video })
          else if (response.data.url || response.data._id) {
            videoData = response.data;
          }
        }
        
        if (videoData) {
          setVideo(videoData);
        }
      } catch (error) {
        // Silently handle errors
      }
    };

    fetchActiveVideo();
  }, [isHomePage]);

  useEffect(() => {
    // Auto-play video when component mounts and video is loaded
    if (videoRef.current && video) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // Autoplay might be blocked by browser
          setIsPlaying(false);
        }
      };
      
      playVideo();
    }
  }, [video]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVisible(false);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };


  // Only show on homepage
  if (!isHomePage || !video || !isVisible) {
    return null;
  }

  return (
    <div 
      className="position-fixed home-video-container"
      style={{
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        width: '220px',
        maxWidth: '90vw',
      }}
    >
      <div 
        style={{
          position: 'relative',
          backgroundColor: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#dc3545',
            border: 'none',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c82333';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#dc3545';
          }}
          title="Close video"
        >
          ×
        </button>

        {/* Mute/Unmute button */}
        <button
          onClick={handleMuteToggle}
          style={{
            position: 'absolute',
            top: '6px',
            right: '36px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#0d6efd',
            border: 'none',
            color: 'white',
            fontSize: '12px',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0b5ed7';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#0d6efd';
          }}
          title={isMuted ? "Unmute video" : "Mute video"}
        >
          <i className={`bi ${isMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
        </button>

        {/* Video element */}
        <video
          ref={videoRef}
          src={video.url}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            maxHeight: '350px',
          }}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onClick={handlePlayPause}
          onPlay={() => {
            setIsPlaying(true);
          }}
          onPause={() => {
            setIsPlaying(false);
          }}
        />

        {/* Play/Pause overlay (shows when paused) */}
        {!isPlaying && (
          <div
            onClick={handlePlayPause}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
          >
            <i className="bi bi-play-fill" style={{ fontSize: '24px', color: '#000', marginLeft: '3px' }}></i>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .home-video-container {
            bottom: 90px !important;
            right: 10px !important;
            width: 160px !important;
            max-width: 40vw !important;
          }
          
          .home-video-container video {
            max-height: 250px !important;
          }
          
          .home-video-container button {
            width: 20px !important;
            height: 20px !important;
            font-size: 12px !important;
          }
          
          .home-video-container button[title*="Mute"] {
            right: 28px !important;
            font-size: 10px !important;
          }
          
          .home-video-container .bi-play-fill {
            font-size: 18px !important;
          }
        }
        
        @media (max-width: 576px) {
          .home-video-container {
            bottom: 90px !important;
            right: 8px !important;
            width: 140px !important;
            max-width: 35vw !important;
          }
          
          .home-video-container video {
            max-height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
}

// Export as dynamic component with no SSR to avoid hydration issues
const HomeVideo = dynamic(() => Promise.resolve(HomeVideoComponent), {
  ssr: false,
  loading: () => null
});

export default HomeVideo;


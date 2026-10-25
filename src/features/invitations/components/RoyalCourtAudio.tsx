import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "../../../components/common/Icon";
import "./RoyalCourtAudio.css";

/* ==========================================================================
   BỘ TẠO ÂM NHÃ NHẠC CUNG ĐÌNH BẰNG WEB AUDIO API THUẦN (100% OFFLINE)
   Thang âm Ngũ Cung truyền thống Cố Đô: Hò - Xự - Xang - Xê - Cống
   ========================================================================== */
const PENTATONIC_FREQS = [
  261.63, // C4 (Hò)
  293.66, // D4 (Xự)
  349.23, // F4 (Xang)
  392.0,  // Xê (G4)
  440.0,  // Cống (A4)
  523.25, // C5 (Hò cao)
  587.33, // D5 (Xự cao)
];

// Giai điệu hoài niệm Cung Đình Huế nhẹ nhàng
const ROYAL_MELODY = [
  { note: 0, dur: 0.8 },
  { note: 1, dur: 0.6 },
  { note: 3, dur: 1.0 },
  { note: 2, dur: 0.8 },
  { note: 4, dur: 1.4 },
  { note: 3, dur: 0.8 },
  { note: 1, dur: 0.6 },
  { note: 0, dur: 1.6 },
  { note: 5, dur: 1.0 },
  { note: 4, dur: 0.8 },
  { note: 3, dur: 1.2 },
  { note: 1, dur: 0.8 },
  { note: 0, dur: 2.0 },
];

export function useRoyalCourtAudio(initialVolume = 0.25) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const timeoutIdRef = useRef<number | null>(null);

  const playTone = useCallback((freq: number, duration: number, vol: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }, []);

  const startMelodyLoop = useCallback(
    (stepIndex = 0) => {
      if (!isPlayingRef.current) return;
      const step = ROYAL_MELODY[stepIndex % ROYAL_MELODY.length];
      if (!step) return;
      const freq = PENTATONIC_FREQS[step.note] ?? 261.63;
      playTone(freq, step.dur, initialVolume);

      const nextTimeout = step.dur * 1000 + 150;
      timeoutIdRef.current = window.setTimeout(() => {
        startMelodyLoop(stepIndex + 1);
      }, nextTimeout);
    },
    [playTone, initialVolume]
  );

  const togglePlay = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }

    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (timeoutIdRef.current) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    } else {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      isPlayingRef.current = true;
      setIsPlaying(true);
      startMelodyLoop(0);
    }
  }, [startMelodyLoop]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timeoutIdRef.current) {
        window.clearTimeout(timeoutIdRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return { isPlaying, togglePlay, stop };
}

export function RoyalCourtAudio() {
  const { isPlaying, togglePlay } = useRoyalCourtAudio(0.25);

  return (
    <div className="royal-audio-widget" aria-label="Bộ điều khiển Nhã Nhạc Cung Đình">
      <button
        type="button"
        className={`royal-disc-btn ${isPlaying ? "disc-spinning" : ""}`}
        onClick={togglePlay}
        title={isPlaying ? "Tạm dừng Nhã Nhạc Cung Đình" : "Bật Nhã Nhạc Cung Đình truyền thống"}
        aria-pressed={isPlaying}
      >
        {/* Đĩa Vinyl Hoàng Gia & Hoa Sen vẽ bằng Pure SVG */}
        <svg viewBox="0 0 60 60" className="royal-vinyl-svg" aria-hidden="true">
          <circle cx="30" cy="30" r="28" fill="#1A130B" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="30" cy="30" r="23" fill="none" stroke="#3A2D1D" strokeWidth="1" strokeDasharray="2,3" />
          <circle cx="30" cy="30" r="18" fill="none" stroke="#3A2D1D" strokeWidth="1" strokeDasharray="3,4" />
          <circle cx="30" cy="30" r="12" fill="#8B0000" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Biểu tượng hoa sen vàng ở tâm đĩa */}
          <path
            d="M30 22 C32 26, 35 28, 30 33 C25 28, 28 26, 30 22 Z"
            fill="#D4AF37"
          />
          <circle cx="30" cy="30" r="3" fill="#1A130B" />
        </svg>

        <span className="royal-audio-icon-overlay">
          <Icon name={isPlaying ? "music" : "volumeX"} size={16} color="#FFFFFF" />
        </span>
      </button>

      <div className="royal-audio-label-group">
        <span className="royal-audio-title">Nhã Nhạc Cung Đình</span>
        <span className="royal-audio-status">
          {isPlaying ? "Đang tấu khúc ngũ cung..." : "Chạm đĩa để phát nhạc"}
        </span>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Soundscapes.module.css";

interface SoundscapesProps {
  activeIndex: number; // 0: Wedding, 1: Celebrations, 2: Styling, 3: Production
}

export default function Soundscapes({ activeIndex }: SoundscapesProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const channelsRef = useRef<{ gainNode: GainNode; stop: () => void }[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize Audio Context and Synthesizers
  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime); // Low background volume
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Channel 0: Wedding (Warm romantic luxury pad)
      const ch0 = createWeddingSynth(ctx, masterGain);
      // Channel 1: Celebrations (Soft warm keys & rhythm chime)
      const ch1 = createCelebrationsSynth(ctx, masterGain);
      // Channel 2: Event Styling (Minimalist atmospheric light drone & glass chimes)
      const ch2 = createStylingSynth(ctx, masterGain);
      // Channel 3: Production (Low camera-whir drone & cinematic focus pulse)
      const ch3 = createProductionSynth(ctx, masterGain);

      channelsRef.current = [ch0, ch1, ch2, ch3];

      // Initially set the active channel volume to 1, others to 0
      channelsRef.current.forEach((ch, idx) => {
        ch.gainNode.gain.setValueAtTime(idx === activeIndex ? 1 : 0, ctx.currentTime);
      });
    } catch (e) {
      console.error("Failed to initialize Web Audio API:", e);
    }
  };

  // Crossfade between channels when activeIndex changes
  useEffect(() => {
    if (!audioCtxRef.current || channelsRef.current.length === 0) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const fadeTime = 1.5; // Smooth 1.5 second crossfade

    channelsRef.current.forEach((ch, idx) => {
      const targetVolume = idx === activeIndex ? 1 : 0;
      ch.gainNode.gain.cancelScheduledValues(now);
      ch.gainNode.gain.setValueAtTime(ch.gainNode.gain.value, now);
      ch.gainNode.gain.linearRampToValueAtTime(targetVolume, now + fadeTime);
    });
  }, [activeIndex]);

  // Handle Mute/Play Toggle
  const togglePlay = async () => {
    if (showPrompt) setShowPrompt(false);

    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    if (isPlaying) {
      // Fade out master volume
      masterGainRef.current?.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      setTimeout(() => {
        if (ctx.state === "running") {
          ctx.suspend();
        }
        setIsPlaying(false);
      }, 300);
    } else {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      // Fade in master volume
      masterGainRef.current?.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGainRef.current?.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.5);
      setIsPlaying(true);
    }
  };

  // Clean up synthesizers on unmount
  useEffect(() => {
    return () => {
      channelsRef.current.forEach((ch) => ch.stop());
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Theme Names for UI
  const themeNames = [
    "Symphonie d'Amour (Wedding)",
    "Soirée Dorée (Celebrations)",
    "Minimalisme (Event Styling)",
    "Mise-en-Scène (Production)",
  ];

  return (
    <div className={styles.soundscapesContainer}>
      {showPrompt && (
        <div className={styles.promptBubble} onClick={togglePlay}>
          <span>Experience with Sound</span>
          <div className={styles.promptArrow}></div>
        </div>
      )}

      <button
        onClick={togglePlay}
        className={`${styles.audioButton} ${isPlaying ? styles.playing : ""}`}
        aria-label="Toggle background ambiance"
      >
        <div className={styles.visualizer}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        <span className={styles.themeLabel}>
          {isPlaying ? themeNames[activeIndex] : "Sound Off"}
        </span>
      </button>
    </div>
  );
}

/* ==========================================
   Procedural Synthesizers using Web Audio API
   ========================================== */

// 1. Wedding: Soft major chord pad (Fmaj7 / G6)
function createWeddingSynth(ctx: AudioContext, destination: AudioNode) {
  const gainNode = ctx.createGain();
  gainNode.connect(destination);

  // Frequencies for a beautiful major-ninth pad: F3, C4, E4, G4, A4
  const freqs = [174.61, 261.63, 329.63, 392.00, 440.00];
  const oscillators: { osc: OscillatorNode; oscGain: GainNode }[] = [];

  // Create oscillators for pad notes
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    // Mix triangle (warm) and sine (pure) for a luxury organ/string sound
    osc.type = idx % 2 === 0 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Subtle panning
    const panner = ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.setPosition(Math.sin(idx * 2) * 2, 0, 1 - Math.abs(Math.sin(idx * 2)));

    // Connect node chain
    osc.connect(oscGain);
    oscGain.connect(panner);
    panner.connect(gainNode);

    // Initial low volume
    oscGain.gain.setValueAtTime(0.04 / freqs.length, ctx.currentTime);
    osc.start();

    // Subtle LFO-like volume sweep to make the pad float
    const sweepVolume = () => {
      const now = ctx.currentTime;
      const duration = 4 + idx * 1.5;
      oscGain.gain.setValueAtTime(oscGain.gain.value, now);
      oscGain.gain.linearRampToValueAtTime((0.02 + Math.random() * 0.04) / freqs.length, now + duration / 2);
      oscGain.gain.linearRampToValueAtTime(0.02 / freqs.length, now + duration);
    };
    
    const interval = setInterval(sweepVolume, (4 + idx * 1.5) * 1000);
    oscillators.push({ osc, oscGain });

    // Store interval cleanup
    (osc as any).intervalId = interval;
  });

  return {
    gainNode,
    stop: () => {
      oscillators.forEach((o) => {
        clearInterval((o.osc as any).intervalId);
        o.osc.stop();
      });
    },
  };
}

// 2. Celebrations: Upbeat warm keys & chime
function createCelebrationsSynth(ctx: AudioContext, destination: AudioNode) {
  const gainNode = ctx.createGain();
  gainNode.connect(destination);

  // Background warm drone (C3 / C4)
  const baseOsc = ctx.createOscillator();
  baseOsc.type = "sine";
  baseOsc.frequency.setValueAtTime(130.81, ctx.currentTime);
  const baseGain = ctx.createGain();
  baseGain.gain.setValueAtTime(0.05, ctx.currentTime);
  baseOsc.connect(baseGain);
  baseGain.connect(gainNode);
  baseOsc.start();

  // Play random gentle warm rhodes-like bells on interval
  const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C major pentatonic
  const playNote = () => {
    if (ctx.state !== "running") return;
    const now = ctx.currentTime;
    const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const noteGain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(note, now);

    // Warm rhodes-like filter sweep
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(150, now + 1.2);

    // Envelope
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(gainNode);

    osc.start(now);
    osc.stop(now + 2.6);
  };

  const intervalId = setInterval(playNote, 2400);

  return {
    gainNode,
    stop: () => {
      clearInterval(intervalId);
      baseOsc.stop();
    },
  };
}

// 3. Event Styling: Minimalist atmospheric light drone & glass chimes
function createStylingSynth(ctx: AudioContext, destination: AudioNode) {
  const gainNode = ctx.createGain();
  gainNode.connect(destination);

  // Absolute low drone (A2 / A3)
  const droneOsc = ctx.createOscillator();
  droneOsc.type = "sine";
  droneOsc.frequency.setValueAtTime(110.00, ctx.currentTime);
  const droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.06, ctx.currentTime);
  droneOsc.connect(droneGain);
  droneGain.connect(gainNode);
  droneOsc.start();

  // Gentle high crystal glass bells
  const highNotes = [880.00, 987.77, 1174.66, 1318.51, 1567.98]; // High A minor pentatonic
  const playChime = () => {
    if (ctx.state !== "running") return;
    const now = ctx.currentTime;
    const note = highNotes[Math.floor(Math.random() * highNotes.length)];

    const osc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    const panner = ctx.createPanner();

    osc.type = "sine";
    osc.frequency.setValueAtTime(note, now);

    panner.panningModel = "HRTF";
    panner.setPosition((Math.random() - 0.5) * 4, 0, 1);

    // Fast bell attack, long ringing decay
    chimeGain.gain.setValueAtTime(0.0001, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.02, now + 0.01);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

    osc.connect(panner);
    panner.connect(chimeGain);
    chimeGain.connect(gainNode);

    osc.start(now);
    osc.stop(now + 4.1);
  };

  const intervalId = setInterval(playChime, 3800);

  return {
    gainNode,
    stop: () => {
      clearInterval(intervalId);
      droneOsc.stop();
    },
  };
}

// 4. Production: Cinematic focus pulse & camera tick shutter click
function createProductionSynth(ctx: AudioContext, destination: AudioNode) {
  const gainNode = ctx.createGain();
  gainNode.connect(destination);

  // Rhythmic heartbeat/pulse drone (72 BPM)
  const pulseOsc = ctx.createOscillator();
  pulseOsc.type = "sine";
  pulseOsc.frequency.setValueAtTime(60.00, ctx.currentTime); // Low E
  const pulseGain = ctx.createGain();
  pulseOsc.connect(pulseGain);
  pulseGain.connect(gainNode);
  pulseGain.gain.setValueAtTime(0.0001, ctx.currentTime);
  pulseOsc.start();

  const playPulse = () => {
    if (ctx.state !== "running") return;
    const now = ctx.currentTime;
    pulseGain.gain.cancelScheduledValues(now);
    pulseGain.gain.setValueAtTime(0.0001, now);
    pulseGain.gain.linearRampToValueAtTime(0.06, now + 0.15);
    pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  };

  // Film reel/projector sound simulated with soft noise clicks
  const playCameraClick = () => {
    if (ctx.state !== "running") return;
    const now = ctx.currentTime;

    // Create a very quick noise buffer for a "shutter click"
    const bufferSize = ctx.sampleRate * 0.08; // 80ms of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(2500, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.005, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(gainNode);

    noise.start(now);
  };

  const intervalPulse = setInterval(playPulse, 1666); // ~36 BPM pulse
  const intervalClick = setInterval(playCameraClick, 5000); // Sporadic shutters

  return {
    gainNode,
    stop: () => {
      clearInterval(intervalPulse);
      clearInterval(intervalClick);
      pulseOsc.stop();
    },
  };
}

'use client';
import { useCallback, useRef, useState } from 'react';
export interface Speakable {
  label: string;
  audioUrl?: string | null;
}
export function useVoicePlayer() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playAudioUrl = useCallback((url: string) => {
    return new Promise<void>((resolve) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }, []);
  const speakText = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }, []);
  const speak = useCallback(
    async (tiles: Speakable[]) => {
      if (tiles.length === 0) return;
      setSpeaking(true);
      window.speechSynthesis?.cancel();
      for (const tile of tiles) {
        if (tile.audioUrl) {
          await playAudioUrl(tile.audioUrl);
        } else {
          await speakText(tile.label);
        }
      }
      setSpeaking(false);
    },
    [playAudioUrl, speakText]
  );
  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    setSpeaking(false);
  }, []);
  return { speak, stop, speaking };
}

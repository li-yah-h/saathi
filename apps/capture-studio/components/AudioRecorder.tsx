'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDurationMs?: number;
}

type RecorderState = 'idle' | 'recording' | 'recorded' | 'error';

/**
 * Hold-to-record voice anchor capture. Works with pointer events so it
 * behaves the same on touch and mouse, which matters since Capture
 * Studio is used on tablets during onboarding sessions.
 */
export default function AudioRecorder({ onRecordingComplete, maxDurationMs = 6000 }: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const maxDurationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => cleanupStream, [cleanupStream]);

  const startRecording = useCallback(async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        onRecordingComplete(blob);
        cleanupStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState('recording');

      maxDurationTimer.current = setTimeout(() => {
        stopRecording();
      }, maxDurationMs);
    } catch (err) {
      setErrorMessage('Microphone access was denied or is unavailable on this device.');
      setState('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDurationMs, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (maxDurationTimer.current) clearTimeout(maxDurationTimer.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setState('recorded');
  }, []);

  const handleReRecord = useCallback(() => {
    setAudioUrl(null);
    setState('idle');
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onPointerDown={state !== 'recording' ? startRecording : undefined}
        onPointerUp={state === 'recording' ? stopRecording : undefined}
        onPointerLeave={state === 'recording' ? stopRecording : undefined}
        aria-pressed={state === 'recording'}
        className={`flex h-20 w-20 select-none items-center justify-center rounded-full text-white shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
          state === 'recording' ? 'bg-red-600 animate-pulse' : 'bg-slate-900 hover:bg-slate-700'
        }`}
      >
        {state === 'recording' ? 'Stop' : 'Hold'}
      </button>

      <p className="text-sm text-slate-500">
        {state === 'recording'
          ? 'Recording… release to stop'
          : state === 'recorded'
            ? 'Voice anchor captured'
            : 'Press and hold to record the voice anchor'}
      </p>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {audioUrl && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={audioUrl} className="h-9" />
          <button
            type="button"
            onClick={handleReRecord}
            className="text-sm font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            Re-record
          </button>
        </div>
      )}
    </div>
  );
}

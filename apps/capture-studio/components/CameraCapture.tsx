'use client';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onRetake?: () => void;
}
const videoConstraints: MediaTrackConstraints = {
  width: 720,
  height: 720,
  facingMode: 'environment',
};
export default function CameraCapture({ onCapture, onRetake }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const handleShutter = useCallback(() => {
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) {
      setCameraError("Couldn't capture a frame. Point the camera at the item and try again.");
      return;
    }
    setPreview(shot);
    onCapture(shot);
  }, [onCapture]);

  const handleRetake = useCallback(() => {
    setPreview(null);
    setCameraError(null);
    onRetake?.();
  }, [onRetake]);
  return (
    <div className="w-full">
      <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
        {preview ? (
          <img src={preview} alt="Captured tile preview" className="h-full w-full object-cover" />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={() =>
              setCameraError('Camera access was denied or is unavailable on this device.')
            }
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {cameraError && (
        <p role="alert" className="mt-2 text-center text-sm text-red-600">
          {cameraError}
        </p>
      )}

      <div className="mt-4 flex justify-center gap-3">
        {preview ? (
          <button
            type="button"
            onClick={handleRetake}
            className="rounded-full border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            Retake photo
          </button>
        ) : (
          <button
            type="button"
            onClick={handleShutter}
            className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Take photo
          </button>
        )}
      </div>
    </div>
  );
}

'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import CameraCapture from '@/components/CameraCapture';
import AudioRecorder from '@/components/AudioRecorder';

type Step = 'photo' | 'label' | 'voice' | 'review';

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(',');
  const mime = meta.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export default function CaptureStudioPage() {
  const [step, setStep] = useState<Step>('photo');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isDynamicSlot, setIsDynamicSlot] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canContinueFromLabel = label.trim().length > 0;

  const resetForNextTile = useCallback(() => {
    setStep('photo');
    setImageDataUrl(null);
    setLabel('');
    setAudioBlob(null);
    setIsDynamicSlot(false);
    setSubmitError(null);
    setSubmitted(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!imageDataUrl || !canContinueFromLabel) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('image', dataUrlToBlob(imageDataUrl), 'tile.jpg');
      if (audioBlob) formData.append('audio', audioBlob, 'anchor.webm');
      formData.append('label', label.trim());
      formData.append('is_dynamic_slot', String(isDynamicSlot));

      const res = await fetch('/api/upload-tile', { method: 'POST', body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Upload failed with status ${res.status}`);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong saving the tile.');
    } finally {
      setSubmitting(false);
    }
  }, [imageDataUrl, audioBlob, label, isDynamicSlot, canContinueFromLabel]);

  const stepIndex = useMemo(() => ({ photo: 0, label: 1, voice: 2, review: 3 })[step], [step]);

  return (
    <main>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Capture a new tile</h1>
          <p className="text-sm text-slate-500">Fast-Tag flow — photo, label, voice anchor.</p>
        </div>
        <Link
          href="/edit-mode"
          className="text-sm font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
        >
          Go to Edit Mode
        </Link>
      </header>

      <ol className="mb-8 flex gap-2" aria-label="Capture progress">
        {(['photo', 'label', 'voice', 'review'] as Step[]).map((s, i) => (
          <li
            key={s}
            className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? 'bg-slate-900' : 'bg-slate-200'}`}
          />
        ))}
      </ol>

      {submitted ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-medium text-emerald-800">Tile saved.</p>
          <p className="mt-1 text-sm text-emerald-700">
            &ldquo;{label}&rdquo; is ready. It will appear once its embedding finishes processing.
          </p>
          <button
            type="button"
            onClick={resetForNextTile}
            className="mt-4 rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Capture another tile
          </button>
        </div>
      ) : (
        <>
          {step === 'photo' && (
            <section>
              <CameraCapture
                onCapture={(dataUrl) => {
                  setImageDataUrl(dataUrl);
                  setStep('label');
                }}
              />
            </section>
          )}

          {step === 'label' && (
            <section className="space-y-4">
              {imageDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageDataUrl}
                  alt="Captured tile"
                  className="mx-auto aspect-square w-40 rounded-xl object-cover"
                />
              )}
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Label</span>
                <input
                  autoFocus
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. more, water, all done"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isDynamicSlot}
                  onChange={(e) => setIsDynamicSlot(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Eligible for the dynamic (context-predicted) column
              </label>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('photo')}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canContinueFromLabel}
                  onClick={() => setStep('voice')}
                  className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {step === 'voice' && (
            <section className="space-y-6">
              <AudioRecorder onRecordingComplete={setAudioBlob} />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('label')}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  {audioBlob ? 'Continue' : 'Skip voice anchor'}
                </button>
              </div>
            </section>
          )}

          {step === 'review' && (
            <section className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                {imageDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageDataUrl}
                    alt="Captured tile"
                    className="mx-auto aspect-square w-32 rounded-xl object-cover"
                  />
                )}
                <p className="mt-3 text-center text-lg font-medium">{label}</p>
                <p className="text-center text-sm text-slate-500">
                  {audioBlob ? 'Voice anchor recorded' : 'No voice anchor'} ·{' '}
                  {isDynamicSlot ? 'Dynamic slot candidate' : 'Static tile'}
                </p>
              </div>

              {submitError && (
                <p role="alert" className="text-sm text-red-600">
                  {submitError}
                </p>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('voice')}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {submitting ? 'Saving…' : 'Save tile'}
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

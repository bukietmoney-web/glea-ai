'use client'

import { useEffect, useRef, useState } from 'react'
import { Clapperboard, MessageCircle, Sparkles, Wand2 } from 'lucide-react'
import { ImageUploader } from './image-uploader'
import { VoiceSelector, VOICES } from './voice-selector'

type Status = 'idle' | 'error' | 'generating' | 'done'

export function GleaGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [motion, setMotion] = useState('')
  const [dialogue, setDialogue] = useState('')
  const [voice, setVoice] = useState(VOICES[0].id)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [previewUrl])

  function handleSelect(selected: File) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setStatus('idle')
    setMessage('')
  }

  function handleClear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
  }

  function handleGenerate() {
    if (!file) {
      setStatus('error')
      setMessage('Please upload an image first.')
      return
    }
    if (!motion.trim()) {
      setStatus('error')
      setMessage('Describe the motion you want to see.')
      return
    }

    setStatus('generating')
    setMessage('Glea AI is bringing your image to life...')
    setProgress(0)

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (timerRef.current) clearInterval(timerRef.current)
          setStatus('done')
          setMessage('Your video is ready to preview and share!')
          return 100
        }
        return Math.min(p + Math.random() * 18, 100)
      })
    }, 500)
  }

  const isGenerating = status === 'generating'

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      {/* Card 1: Upload */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/5 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-card-foreground">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          Upload your image
        </h2>
        <ImageUploader
          previewUrl={previewUrl}
          onSelect={handleSelect}
          onClear={handleClear}
        />
      </section>

      {/* Card 2: Motion + dialogue + voice */}
      <section className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/5 sm:p-6">
        <div>
          <label
            htmlFor="motion"
            className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"
          >
            <Wand2 className="h-4 w-4 text-primary" aria-hidden="true" />
            Motion prompt
          </label>
          <textarea
            id="motion"
            value={motion}
            onChange={(e) => setMotion(e.target.value)}
            rows={3}
            placeholder="Make the person smile, wave, and slowly walk forward as the camera pushes in."
            className="w-full resize-none rounded-2xl border-2 border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="dialogue"
            className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"
          >
            <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
            Dialogue
          </label>
          <textarea
            id="dialogue"
            value={dialogue}
            onChange={(e) => setDialogue(e.target.value)}
            rows={2}
            placeholder='What should they say? e.g. "Hey there — welcome to Glea AI!"'
            className="w-full resize-none rounded-2xl border-2 border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <VoiceSelector value={voice} onChange={setVoice} />
      </section>

      {/* Generate */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-primary to-secondary px-6 py-4 text-lg font-extrabold text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          <Clapperboard className="h-5 w-5" aria-hidden="true" />
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>

        {isGenerating && (
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {message && (
          <p
            role="status"
            className={`text-center text-sm font-medium ${
              status === 'error'
                ? 'text-accent-foreground'
                : 'text-muted-foreground'
            }`}
          >
            {message}
          </p>
        )}

        {status === 'done' && previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl || '/placeholder.svg'}
              alt="Generated video preview frame"
              className="aspect-video w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}

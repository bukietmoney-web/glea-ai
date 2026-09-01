'use client'

import { Check, Mic } from 'lucide-react'

export type Voice = {
  id: string
  name: string
  tag: string
  gradient: string
}

export const VOICES: Voice[] = [
  { id: 'aria', name: 'Aria', tag: 'Warm & friendly', gradient: 'from-pink-400 to-rose-500' },
  { id: 'nova', name: 'Nova', tag: 'Bright & upbeat', gradient: 'from-cyan-400 to-sky-500' },
  { id: 'zane', name: 'Zane', tag: 'Deep & calm', gradient: 'from-violet-500 to-purple-600' },
  { id: 'lumi', name: 'Lumi', tag: 'Soft & gentle', gradient: 'from-amber-300 to-orange-500' },
  { id: 'echo', name: 'Echo', tag: 'Bold & clear', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'kai', name: 'Kai', tag: 'Playful & fun', gradient: 'from-fuchsia-400 to-pink-600' },
]

export function VoiceSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  return (
    <fieldset>
      <legend className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        <Mic className="h-4 w-4 text-primary" aria-hidden="true" />
        Choose a voice
      </legend>
      <div
        role="radiogroup"
        aria-label="Voice selection"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {VOICES.map((voice) => {
          const selected = value === voice.id
          return (
            <button
              key={voice.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(voice.id)}
              className={`relative flex flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition-all ${
                selected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${voice.gradient} text-sm font-bold text-white shadow-sm`}
                aria-hidden="true"
              >
                {voice.name[0]}
              </span>
              <span className="mt-1 text-sm font-bold text-card-foreground">
                {voice.name}
              </span>
              <span className="text-xs text-muted-foreground">{voice.tag}</span>
              {selected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">Selected</span>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

'use client'

import { useRef, useState, type DragEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'

export function ImageUploader({
  previewUrl,
  onSelect,
  onClear,
}: {
  previewUrl: string | null
  onSelect: (file: File) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file && file.type.startsWith('image/')) {
      onSelect(file)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  if (previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-2 border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl || '/placeholder.svg'}
          alt="Preview of your uploaded image"
          className="aspect-video w-full object-cover"
        />
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/70 text-background backdrop-blur transition-colors hover:bg-foreground"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-3 border-dashed px-6 py-12 text-center transition-colors ${
        dragging
          ? 'border-primary bg-primary/10'
          : 'border-primary/40 bg-muted/50 hover:bg-muted'
      }`}
      style={{ borderWidth: 3 }}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg">
        <ImagePlus className="h-7 w-7" aria-hidden="true" />
      </span>
      <div>
        <p className="text-base font-bold text-foreground">Tap to upload your image</p>
        <p className="mt-1 text-sm text-muted-foreground">
          or drag &amp; drop a photo here
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

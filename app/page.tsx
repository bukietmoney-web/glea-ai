import { Film } from 'lucide-react'
import { GleaGenerator } from '@/components/glea-generator'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Colorful ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-accent/25 via-background to-secondary/25"
      />
      <div
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-float-slow pointer-events-none absolute -right-20 top-1/3 -z-10 h-64 w-64 rounded-full bg-secondary/25 blur-3xl"
        style={{ animationDelay: '2s' }}
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur">
            <Film className="h-4 w-4" aria-hidden="true" />
            Image to Video
          </div>
          <h1 className="text-balance bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Glea AI
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-base text-muted-foreground sm:text-lg">
            Turn your images into amazing videos. Upload a photo, describe the
            motion, add dialogue and a voice, then hit generate.
          </p>
        </header>

        <GleaGenerator />

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Made with Glea AI — your photos, brought to motion.
        </footer>
      </div>
    </main>
  )
}

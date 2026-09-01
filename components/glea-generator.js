"use client"

import { useRef, useState } from "react"

const VOICES = [
  { id: "en-US-JennyNeural", label: "Jenny — Female (US English)" },
  { id: "en-US-GuyNeural", label: "Guy — Male (US English)" },
  { id: "en-US-AriaNeural", label: "Aria — Female (US English)" },
  { id: "en-GB-SoniaNeural", label: "Sonia — Female (UK English)" },
  { id: "en-GB-RyanNeural", label: "Ryan — Male (UK English)" },
  { id: "en-AU-NatashaNeural", label: "Natasha — Female (Australian)" },
]

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function GleaGenerator() {
  const imageInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [dialogue, setDialogue] = useState("")
  const [voice, setVoice] = useState(VOICES[0].id)
  const [prompt, setPrompt] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setVideoUrl("")
      setMessage("")
    }
  }

  async function generateVideo() {
    if (!imageFile) {
      setMessage("Please upload an image first 📷")
      return
    }
    if (!dialogue.trim()) {
      setMessage("Please enter the dialogue you want spoken ✍️")
      return
    }

    setLoading(true)
    setVideoUrl("")
    setMessage("Glea AI is generating your video… this can take a moment 🎬")

    try {
      const imageDataUrl = await readFileAsDataUrl(imageFile)

      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageDataUrl,
          dialogue: dialogue.trim(),
          voice,
          prompt: prompt.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Something went wrong. Please try again.")
        return
      }

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl)
        setMessage("Your video is ready! 🎉")
      } else {
        setMessage(data.message || "Video request submitted successfully.")
      }
    } catch (err) {
      setMessage("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <label className="upload">
        📷
        <br />
        <br />
        <strong>Tap here to upload your image</strong>
        <br />
        Choose a photo from your phone
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>

      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img id="preview" src={previewUrl || "/placeholder.svg"} alt="Uploaded image preview" />
      ) : null}

      <label className="field-label" htmlFor="dialogue">
        💬 Dialogue
      </label>
      <textarea
        id="dialogue"
        className="dialogue-input"
        value={dialogue}
        onChange={(e) => setDialogue(e.target.value)}
        placeholder="What should your character say? Type the words you want spoken out loud."
      />

      <label className="field-label" htmlFor="voice">
        🎙️ Voice
      </label>
      <select id="voice" value={voice} onChange={(e) => setVoice(e.target.value)}>
        {VOICES.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
          </option>
        ))}
      </select>

      <label className="field-label" htmlFor="prompt">
        🎬 Movement
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={"Describe the movement you want...\n\nExample:\nMake the person smile, wave and slowly walk forward."}
      />

      <button className="generate" onClick={generateVideo} disabled={loading}>
        {loading ? "Generating…" : "🎬 Generate Video"}
      </button>

      <div className="message" id="message">
        {message}
      </div>

      {videoUrl ? (
        <video className="result-video" src={videoUrl} controls autoPlay loop playsInline />
      ) : null}
    </div>
  )
}

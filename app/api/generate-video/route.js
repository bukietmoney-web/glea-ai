import { NextResponse } from "next/server"

const DID_BASE_URL = "https://api.d-id.com"

// Convert a data URL (data:image/png;base64,....) into a Blob for upload.
function dataUrlToBlob(dataUrl) {
  const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl)
  if (!match) return null
  const mime = match[1]
  const buffer = Buffer.from(match[2], "base64")
  return new Blob([buffer], { type: mime })
}

function extensionForMime(mime) {
  if (mime === "image/png") return "png"
  if (mime === "image/webp") return "webp"
  return "jpg"
}

export async function POST(request) {
  const apiKey = process.env.DID_API_KEY

  // The key stays server-side only. Never returned to the client.
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The D-ID API key is not configured yet. Add DID_API_KEY as an environment variable to enable video generation.",
      },
      { status: 501 },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const { image, dialogue, voice, prompt } = body || {}

  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "An image is required." }, { status: 400 })
  }
  if (!dialogue || typeof dialogue !== "string" || !dialogue.trim()) {
    return NextResponse.json({ error: "Dialogue text is required." }, { status: 400 })
  }

  const authHeader = `Basic ${apiKey}`

  try {
    // 1. Upload the source image to D-ID to obtain a hosted source URL.
    let sourceUrl = image
    if (image.startsWith("data:")) {
      const blob = dataUrlToBlob(image)
      if (!blob) {
        return NextResponse.json({ error: "Could not read the uploaded image." }, { status: 400 })
      }

      const form = new FormData()
      form.append("image", blob, `source.${extensionForMime(blob.type)}`)

      const uploadRes = await fetch(`${DID_BASE_URL}/images`, {
        method: "POST",
        headers: { Authorization: authHeader },
        body: form,
      })

      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        return NextResponse.json(
          { error: uploadData?.description || uploadData?.message || "Failed to upload image to D-ID." },
          { status: uploadRes.status },
        )
      }
      sourceUrl = uploadData.url
    }

    // 2. Create a talk (animated speaking video) from the image + dialogue + voice.
    const createRes = await fetch(`${DID_BASE_URL}/talks`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_url: sourceUrl,
        script: {
          type: "text",
          input: dialogue,
          provider: {
            type: "microsoft",
            voice_id: voice || "en-US-JennyNeural",
          },
        },
        config: { stitch: true },
        // The motion prompt is passed along as metadata for future use.
        user_data: prompt ? JSON.stringify({ prompt }) : undefined,
      }),
    })

    const createData = await createRes.json()
    if (!createRes.ok) {
      return NextResponse.json(
        { error: createData?.description || createData?.message || "Failed to create the video." },
        { status: createRes.status },
      )
    }

    const talkId = createData.id

    // 3. Poll for completion (D-ID renders asynchronously).
    const maxAttempts = 30
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, 2000))

      const statusRes = await fetch(`${DID_BASE_URL}/talks/${talkId}`, {
        headers: { Authorization: authHeader },
      })
      const statusData = await statusRes.json()

      if (statusData.status === "done" && statusData.result_url) {
        return NextResponse.json({ videoUrl: statusData.result_url })
      }
      if (statusData.status === "error" || statusData.status === "rejected") {
        return NextResponse.json(
          { error: statusData?.error?.description || "Video generation failed." },
          { status: 502 },
        )
      }
    }

    // Still processing after polling window — return the id so it can be checked later.
    return NextResponse.json({
      message: "Your video is still being generated. Please try again in a moment.",
      talkId,
    })
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error while contacting D-ID." }, { status: 500 })
  }
}

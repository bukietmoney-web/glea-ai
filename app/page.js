import GleaGenerator from "@/components/glea-generator"

export default function Home() {
  return (
    <main className="container">
      <div className="logo">✨ Glea AI</div>

      <div className="subtitle">Turn your images into amazing videos 🎬</div>

      <div className="card">
        <GleaGenerator />
      </div>
    </main>
  )
}

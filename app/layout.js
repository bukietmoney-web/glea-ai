import "./globals.css"

export const metadata = {
  title: "Glea AI",
  description: "Turn your images into amazing videos with Glea AI.",
  generator: "v0.app",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7b2cff",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-background">
      <body>{children}</body>
    </html>
  )
}

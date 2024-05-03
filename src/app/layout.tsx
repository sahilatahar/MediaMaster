import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { MediaProvider } from "@/context/MediaContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Media Master",
	description: "Screen and audio recorder",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<MediaProvider>{children}</MediaProvider>
				<Toaster position="top-right" />
			</body>
		</html>
	)
}

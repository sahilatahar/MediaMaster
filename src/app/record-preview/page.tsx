"use client"
import { FC, useEffect, useState } from "react"
import ReactPlayer from "react-player"
import { useRouter } from "next/navigation"
import { useMediaContext } from "@/context/MediaContext"
import Loading from "@/components/Loading"
import Image from "next/image"

const RecordingPage: FC = () => {
	const { recording, stopRecording, stream, mediaUrl } = useMediaContext()
	const [loading, setLoading] = useState<boolean>(true)
	const router = useRouter()

	const downloadVideo = () => {
		const a = document.createElement("a")
		a.href = mediaUrl
		a.download = "video.mp4"
		a.click()
	}

	useEffect(() => {
		if (stream == null) {
			router.push("/")
		} else {
			setLoading(false)
		}
	}, [router, stream])

	if (loading) return <Loading />

	return (
		<main className="max-w-7xl flex flex-col items-center min-h-screen mx-auto p-4 text-center sm:justify-center gap-8">
			<h1 className="text-3xl sm:text-4xl font-bold pt-8 text-light-text flex gap-6 items-end">
				<Image
					src="/images/recordedVideo.png"
					width={0}
					height={0}
					sizes="100vw"
					alt="Record Screen"
					className="w-16"
					priority
				/>
				{recording ? "Recording Preview" : "Recorded Video"}
			</h1>
			<div className="sm:flex-grow flex items-center w-full sm:w-auto">
				{stream != null && (
					<ReactPlayer
						url={recording ? stream : mediaUrl}
						playing
						controls
						height="auto"
					/>
				)}
			</div>
			{recording ? (
				<button
					className="bg-danger font-2xl w-full sm:w-1/2 py-4 font-bold text-white rounded-xl"
					onClick={stopRecording}
				>
					Stop Recording
				</button>
			) : (
				<button
					className="bg-primary font-2xl w-full sm:w-1/2 py-4 font-bold text-white rounded-xl"
					onClick={downloadVideo}
				>
					Download video
				</button>
			)}
		</main>
	)
}

export default RecordingPage

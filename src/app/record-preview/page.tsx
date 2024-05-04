"use client"
import Loading from "@/components/Loading"
import MediaControlButtons from "@/components/MediaControlButtons"
import { useMediaContext } from "@/context/MediaContext"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FC, useEffect, useState } from "react"
import ReactPlayer from "react-player"

const RecordingPage: FC = () => {
	const { recording, stream, mediaUrl } = useMediaContext()
	const [loading, setLoading] = useState<boolean>(true)
	const router = useRouter()

	useEffect(() => {
		if (stream == null) {
			router.push("/")
		} else {
			setLoading(false)
		}
	}, [router, stream])

	if (loading) return <Loading />

	return (
		<main className="max-w-7xl flex flex-col items-center min-h-screen mx-auto p-4 text-center sm:justify-evenly gap-6">
			<div className="flex flex-col gap-2 items-center">
				<h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-light-text flex gap-6 items-end">
					<Image
						src="/images/recordedVideo.png"
						width={0}
						height={0}
						sizes="100vw"
						alt="Record Screen"
						className="w-12 xs:w-16"
						priority
					/>
					{recording ? "Recording Preview" : "Recorded Video"}
				</h1>
				<p className="text-light-text">
					Please make sure to save your current video before starting
					a new recording.
				</p>
			</div>
			<div className="flex items-center w-full sm:w-auto">
				{stream != null && (
					<ReactPlayer
						url={recording ? stream : mediaUrl}
						playing
						controls
						muted
						height="auto"
					/>
				)}
			</div>
			<MediaControlButtons />
		</main>
	)
}

export default RecordingPage

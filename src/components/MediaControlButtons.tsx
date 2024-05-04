import { useMediaContext } from "@/context/MediaContext"
import HomeButton from "./HomeButton"

function MediaControlButtons() {
	const {
		recording,
		recordingPaused,
		pauseRecording,
		resumeRecording,
		stopRecording,
		mediaUrl,
	} = useMediaContext()

	const downloadVideo = () => {
		const a = document.createElement("a")
		a.href = mediaUrl
		a.download = "video.mp4"
		a.click()
	}

	if (!recording) {
		return (
			<div className="flex gap-4 w-full sm:w-1/2 flex-col xs:flex-row">
				<HomeButton />
				<button
					className="bg-primary font-2xl w-full sm:w-1/2 py-3 font-bold text-white rounded-xl"
					onClick={downloadVideo}
				>
					Download video
				</button>
			</div>
		)
	}

	return (
		<div className="flex gap-4 w-full sm:w-1/2 flex-col xs:flex-row">
			{recordingPaused ? (
				<button
					className="bg-warning font-2xl w-full sm:w-1/2 py-3 font-bold text-white rounded-xl"
					onClick={resumeRecording}
				>
					Resume Recording
				</button>
			) : (
				<button
					className="bg-primary font-2xl w-full sm:w-1/2 py-3 font-bold text-white rounded-xl"
					onClick={pauseRecording}
				>
					Pause Recording
				</button>
			)}
			<button
				className="bg-danger font-2xl w-full sm:w-1/2 py-3 font-bold text-white rounded-xl"
				onClick={stopRecording}
			>
				Stop Recording
			</button>
		</div>
	)
}

export default MediaControlButtons

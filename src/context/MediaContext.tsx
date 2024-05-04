"use client"
import {
	ReactElement,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react"
import { toast } from "react-hot-toast"
import { MediaContextProps } from "@/types"

const MediaContext = createContext<MediaContextProps | null>(null)

export const useMediaContext = (): MediaContextProps => {
	const context = useContext(MediaContext)
	if (context == null) {
		throw new Error("useMediaContext must be used within a MediaProvider")
	}
	return context
}

export const MediaProvider: React.FC<{ children: ReactNode }> = ({
	children,
}): ReactElement => {
	const [recording, setRecording] = useState<boolean>(false)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [selectedOption, setSelectedOption] = useState<string>("")
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
		null
	)
	const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
	const [mediaUrl, setMediaUrl] = useState<string>("")
	const recordingFinish = useRef<boolean>(false)
	const [recordingPaused, setRecordingPaused] = useState<boolean>(false)

	const openMediaDevices = async (constraints: any) => {
		try {
			// Check if getDisplayMedia is supported
			if (!navigator.mediaDevices.getDisplayMedia) {
				console.error("getDisplayMedia is not supported on this device")
				toast.error(
					"Sorry, your browser does not support screen recording."
				)
				return null
			}

			const screenStream = await navigator.mediaDevices.getDisplayMedia(
				constraints
			)
			return screenStream
		} catch (error: any) {
			console.error("Error opening media devices", error)
			if (error.name === "NotAllowedError") {
				toast.error("Permission denied to use media devices")
			} else {
				toast.error("Unable to use media devices")
			}
			return null
		}
	}

	const openUserMedia = async (constraints: any) => {
		try {
			const userStream = await navigator.mediaDevices.getUserMedia(
				constraints
			)
			return userStream
		} catch (error: any) {
			console.error("Error opening user media", error)
			if (error.name === "NotAllowedError") {
				toast.error("Permission denied to use media devices")
			} else {
				toast.error("Unable to use media devices")
			}
			return null
		}
	}

	const startRecording = async () => {
		if (selectedOption === "") {
			toast.error("Choose your recording preference")
			return
		}

		let constraints: any = { video: true }

		if (selectedOption === "screenOnly") {
			constraints = { video: { mediaSource: "screen" } }
		} else if (
			selectedOption === "screenWithAudio" ||
			selectedOption === "screenWithAudioAndMic"
		) {
			constraints = {
				video: { mediaSource: "screen" },
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					sampleRate: 44100,
				},
			}
		}

		const screenStream = await openMediaDevices(constraints)

		if (screenStream == null) return

		if (selectedOption === "screenWithAudioAndMic") {
			const userStream = await openUserMedia({ audio: true })

			if (userStream != null) {
				if (screenStream == null) return

				// Merge screen and mic audio tracks
				const micAudioTracks = userStream.getAudioTracks()[0]
				const screenAudioTrack = screenStream?.getAudioTracks()[0]

				const stream = new MediaStream()

				// Add mic audio track
				stream.addTrack(micAudioTracks)

				// Add screen audio track
				if (screenAudioTrack) stream.addTrack(screenAudioTrack)

				screenStream.getVideoTracks().forEach((videoTrack) => {
					stream.addTrack(videoTrack)
				})

				// Set the new stream which contains both screen and mic audio
				setStream(stream)
			}
		}

		if (stream == null) {
			// Set the screen stream if no mic audio is needed
			setStream(screenStream)
		}

		setRecording(true)
		setMediaUrl("")
		recordingFinish.current = false
	}

	const pauseRecording = () => {
		if (mediaRecorder == null) return
		mediaRecorder.pause()
		setRecordingPaused(true)
	}

	const resumeRecording = () => {
		if (mediaRecorder == null) return
		mediaRecorder.resume()
		setRecordingPaused(false)
	}

	const stopRecording = useCallback(() => {
		if (mediaRecorder == null || recordingFinish.current) return

		// Prevent to call stop multiple times
		const isInactive = mediaRecorder.state === "inactive"
		if (!isInactive) mediaRecorder.stop()

		const blob = new Blob(recordedChunks)
		const url = URL.createObjectURL(blob)
		setMediaUrl(url)
		setRecordedChunks([])
		setRecording(false)
		recordingFinish.current = true
		stream?.getTracks().forEach((track) => track.stop())
	}, [mediaRecorder, recordedChunks, stream])

	useEffect(() => {
		if (stream == null) return

		if (mediaRecorder == null) {
			const recorder: MediaRecorder = new MediaRecorder(stream)
			recorder.start(15)
			setMediaRecorder(recorder)
		} else {
			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					setRecordedChunks((prevChunks) => [...prevChunks, e.data])
				}
			}
			mediaRecorder.onstop = stopRecording
			{
				;(mediaRecorder.stream as any).oninactive = stopRecording
			}
		}
	}, [mediaRecorder, recordedChunks, stopRecording, stream])

	return (
		<MediaContext.Provider
			value={{
				recording,
				stream,
				startRecording,
				stopRecording,
				selectedOption,
				setSelectedOption,
				mediaUrl,
				pauseRecording,
				resumeRecording,
				recordingPaused,
			}}
		>
			{children}
		</MediaContext.Provider>
	)
}

export interface MediaContextProps {
	recording: boolean
	stream: MediaStream | null
	startRecording: () => Promise<void>
	stopRecording: () => void
	selectedOption: string
	setSelectedOption: (option: string) => void
	mediaUrl: string
	pauseRecording: () => void
	resumeRecording: () => void
	recordingPaused: boolean
}

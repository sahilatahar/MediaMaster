"use client";
import { MediaContextProps } from "@/types";
import {
	ReactElement,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "react-hot-toast";

const MediaContext = createContext<MediaContextProps | null>(null);

export const useMediaContext = (): MediaContextProps => {
	const context = useContext(MediaContext);
	if (context == null) {
		throw new Error("useMediaContext must be used within a MediaProvider");
	}
	return context;
};

function mergeAudioStreams(
	screenStream: MediaStream,
	micStream: MediaStream
): MediaStream {
	const context = new AudioContext();
	const destination = context.createMediaStreamDestination();

	if (screenStream.getAudioTracks().length > 0) {
		const source1 = context.createMediaStreamSource(screenStream);
		source1.connect(destination);
	}

	if (micStream.getAudioTracks().length > 0) {
		const source2 = context.createMediaStreamSource(micStream);
		source2.connect(destination);
	}

	// Combine video track(s) from screen with the merged audio tracks
	const combinedStream = new MediaStream([
		...screenStream.getVideoTracks(),
		...destination.stream.getAudioTracks(),
	]);

	return combinedStream;
}

export const MediaProvider: React.FC<{ children: ReactNode }> = ({
	children,
}): ReactElement => {
	const [recording, setRecording] = useState<boolean>(false);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [selectedOption, setSelectedOption] = useState<string>("");
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
		null
	);
	// const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
	const [mediaUrl, setMediaUrl] = useState<string>("");
	const recordingFinish = useRef<boolean>(false);
	const [recordingPaused, setRecordingPaused] = useState<boolean>(false);

	const openMediaDevices = async (constraints: any) => {
		try {
			if (!navigator.mediaDevices.getDisplayMedia) {
				console.error("getDisplayMedia is not supported on this device");
				toast.error("Sorry, your browser does not support screen recording.");
				return null;
			}

			const screenStream = await navigator.mediaDevices.getDisplayMedia(
				constraints
			);
			return screenStream;
		} catch (error: any) {
			console.error("Error opening media devices", error);
			if (error.name === "NotAllowedError") {
				toast.error("Permission denied to use media devices");
			} else {
				toast.error("Unable to use media devices");
			}
			return null;
		}
	};

	const openUserMedia = async (constraints: any) => {
		try {
			const userStream = await navigator.mediaDevices.getUserMedia(constraints);
			return userStream;
		} catch (error: any) {
			console.error("Error opening user media", error);
			if (error.name === "NotAllowedError") {
				toast.error("Permission denied to use media devices");
			} else {
				toast.error("Unable to use media devices");
			}
			return null;
		}
	};

	const startRecording = async () => {
		if (selectedOption === "") {
			toast.error("Choose your recording preference");
			return;
		}

		let constraints: any = { video: true };

		if (selectedOption === "screenOnly") {
			constraints = { video: { mediaSource: "screen" } };
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
			};
		}

		const screenStream = await openMediaDevices(constraints);
		if (!screenStream) return;

		if (selectedOption === "screenWithAudioAndMic") {
			const micStream = await openUserMedia({ audio: true });
			if (micStream) {
				const combinedStream = mergeAudioStreams(screenStream, micStream);
				setStream(combinedStream);
			} else {
				setStream(screenStream);
			}
		} else {
			setStream(screenStream);
		}

		setRecording(true);
		setMediaUrl("");
		recordingFinish.current = false;
	};

	const pauseRecording = () => {
		if (mediaRecorder == null) return;
		mediaRecorder.pause();
		setRecordingPaused(true);
	};

	const resumeRecording = () => {
		if (mediaRecorder == null) return;
		mediaRecorder.resume();
		setRecordingPaused(false);
	};

	const stopRecording = useCallback(() => {
		if (mediaRecorder == null || recordingFinish.current) return;

		if (mediaRecorder.state !== "inactive") mediaRecorder.stop();

		recordingFinish.current = true;
		setRecording(false);
		stream?.getTracks().forEach((track) => track.stop());
	}, [mediaRecorder, stream]);

	useEffect(() => {
		if (!stream) return;

		const mimeType = "video/webm; codecs=vp8,opus";
		const options = MediaRecorder.isTypeSupported(mimeType) ? { mimeType } : {};

		const recorder = new MediaRecorder(stream, options);
		setMediaRecorder(recorder);

		const chunks: Blob[] = [];

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				chunks.push(e.data);
			}
		};

		recorder.onstop = () => {
			const blob = new Blob(chunks, { type: chunks[0]?.type || "video/webm" });
			const url = URL.createObjectURL(blob);
			setMediaUrl(url);
			// setRecordedChunks([]); // Clear old chunks
			recordingFinish.current = true;
		};

		recorder.start(15);

		return () => {
			if (recorder.state !== "inactive") recorder.stop();
		};
	}, [stream]);

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
	);
};

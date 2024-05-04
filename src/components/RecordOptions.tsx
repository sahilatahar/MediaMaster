"use client"
import { useMediaContext } from "@/context/MediaContext"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FC, useEffect } from "react"

const RecordOptions: FC = () => {
	const router = useRouter()

	const { recording, startRecording, selectedOption, setSelectedOption } =
		useMediaContext()

	const handleOptionClick = (e: any) => {
		setSelectedOption(e.currentTarget.dataset.name)
	}

	useEffect(() => {
		if (recording) {
			router.push("/record-preview")
		}
	}, [recording, router])

	const optionClassNames = (option: string) =>
		`flex flex-col items-center justify-center border-2 aspect-square rounded-xl overflow-hidden w-full sm:w-[200px] cursor-pointer select-none ${
			selectedOption === option ? "border-primary" : "border-white"
		}`

	return (
		<div className="flex flex-col items-center gap-8 py-4 justify-center w-full">
			<h2 className="text-xl sm:text-2xl text-light-text">
				What would you like to record?
			</h2>
			<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xs:gap-8 w-full sm:w-auto">
				<div
					className={optionClassNames("screenWithAudio")}
					onClick={handleOptionClick}
					data-name="screenWithAudio"
				>
					<Image
						src="/images/screenWithAudio.png"
						width={0}
						height={0}
						sizes="100vw"
						alt="Record Screen"
						className="w-2/3"
						priority
					/>
					<p className="font-semibold pb-2">Screen & Audio</p>
				</div>
				<div
					className={optionClassNames("screenOnly")}
					onClick={handleOptionClick}
					data-name="screenOnly"
				>
					<Image
						src="/images/screenOnly.png"
						width={0}
						height={0}
						sizes="100vw"
						alt="Record Screen Only"
						className="w-2/3"
						priority
					/>
					<p className="font-semibold pb-2">Screen Only</p>
				</div>
				<div
					className={optionClassNames("screenWithAudioAndMic")}
					onClick={handleOptionClick}
					data-name="screenWithAudioAndMic"
				>
					<Image
						src="/images/screenWithAudioAndMic.png"
						width={0}
						height={0}
						sizes="100vw"
						alt="Record Screen with audio and mic"
						className="w-2/3"
						priority
					/>
					<p className="font-semibold pb-2">Screen & Audio + Mic</p>
				</div>
			</div>
			<button
				className="bg-primary font-2xl w-full sm:w-1/2 py-3 font-bold text-white rounded-xl"
				onClick={startRecording}
			>
				Start Recording
			</button>
		</div>
	)
}

export default RecordOptions

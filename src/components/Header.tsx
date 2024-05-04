import Image from "next/image"
import { FC } from "react"

const Header: FC = () => {
	return (
		<header className="text-center py-6 space-y-4">
			<h1 className="text-3xl sm:text-4xl font-bold text-light-text flex gap-2 items-end">
				<Image
					src="/images/recordedVideo.png"
					width={0}
					height={0}
					sizes="100vw"
					alt="Record Screen"
					className="w-16"
					priority
				/>
				MediaMaster
			</h1>
			<p className="text-light-text">
				Record with Ease, Download Instantly.
			</p>
		</header>
	)
}

export default Header

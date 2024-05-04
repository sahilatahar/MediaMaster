"use client"
import { useRouter } from "next/navigation"

function HomeButton() {
	const router = useRouter()

	const gotoHome = () => {
		router.push("/")
	}
	return (
		<button
			className="bg-warning font-2xl w-full sm:w-1/2 py-3 font-bold text-white rounded-xl"
			onClick={gotoHome}
		>
			Record Another Video
		</button>
	)
}

export default HomeButton

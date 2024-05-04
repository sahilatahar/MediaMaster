import Header from "@/components/Header"
import RecordOptions from "@/components/RecordOptions"

function Home() {
	return (
		<main className="max-w-7xl flex flex-col items-center min-h-screen mx-auto p-4 text-center justify-evenly">
			<Header />
			<RecordOptions />
		</main>
	)
}

export default Home

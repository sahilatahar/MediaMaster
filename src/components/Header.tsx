import { FC } from "react"

const Header: FC = () => {
	return (
		<header className="text-center py-6">
			<h1 className="text-3xl sm:text-4xl font-bold pb-2 text-light-text">
				Record your Screen for Free
			</h1>
			<p className="text-light-text">
				No watermarks, no time limits, no ads.
			</p>
		</header>
	)
}

export default Header

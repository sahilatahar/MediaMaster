import type { Config } from "tailwindcss"

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#9292f6",
				"light-text": "#192033",
				danger: "#ff5454",
				warning: "#e8c03a"
			},
			screens: {
				xs: "475px",
			},
		},
	},
	plugins: [],
}
export default config

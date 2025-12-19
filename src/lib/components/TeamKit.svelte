<script lang="ts">
	let { color }: { color: string } = $props();

	// TODO Dette er litt bob bob. Bør se hva som er en grei løsning i stedet
	const colorMap: Record<string, string> = {
		red: 'oklch(0.637 0.237 25.331)',
		blue: 'oklch(0.607 0.204 254.604)',
		green: 'oklch(0.699 0.17 155.824)',
		yellow: 'oklch(0.808 0.167 93.202)',
		purple: 'oklch(0.67 0.243 305.518)',
		orange: 'oklch(0.696 0.21 41.09)',
		pink: 'oklch(0.676 0.215 352.919)',
		black: 'oklch(0 0 0)',
		white: 'oklch(1 0 0)',
		gray: 'oklch(0.569 0.012 264.364)',
		grey: 'oklch(0.569 0.012 264.364)'
	};

	const fillColor = $derived(colorMap[color.toLowerCase()] || color);
</script>

<svg
	version="1.0"
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 300.000000 293.000000"
	preserveAspectRatio="xMidYMid meet"
	class="drop-shadow-[0_0_1px_rgba(0,0,0,0.7)]"
>
	<g transform="translate(0.000000,293.000000) scale(0.100000,-0.100000)" stroke="none">
		<path
			fill={fillColor}
			d="M414 2665 c-214 -147 -378 -268 -392 -286 -12 -18 -22 -46 -22 -63 1
        -18 54 -142 133 -306 115 -237 137 -277 166 -294 42 -25 48 -22 256 122 l160
        111 5 -932 c4 -723 8 -937 18 -954 31 -55 -3 -53 763 -53 l707 0 30 29 c16 17
        32 44 36 62 3 18 6 440 6 938 0 518 4 905 9 904 5 -1 78 -50 162 -109 201
        -139 208 -142 250 -118 29 17 51 57 166 294 79 164 132 288 133 306 0 17 -10
        45 -22 63 -14 18 -178 139 -392 286 l-368 255 -215 0 -214 0 -32 -34 c-46 -49
        -98 -61 -257 -61 -159 0 -211 12 -257 61 l-32 34 -214 0 -215 0 -368 -255z"
		/>
	</g>
</svg>

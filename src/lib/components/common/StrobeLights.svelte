<div class="flash" />

<style>
	.flash {
		pointer-events: none;
		position: absolute;
		inset: 0;
		background: #f8f8f8;
		animation: flashColors 2s infinite, fadePulse 0.5s ease-in-out;
		animation-iteration-count: infinite;
		animation-delay: -0.1s;
	}

	@keyframes fadePulse {
		0% {
			opacity: 0.05;
		}
		50% {
			opacity: 0.1;
		}
		100% {
			opacity: 0.05;
		}
	}

	@keyframes flashColors {
		0% {
			background: blue;
		}
		25% {
			background: red;
		}
		50% {
			background: green;
		}
		75% {
			background: yellow;
		}
		100% {
			background: blue;
		}
	}

	@keyframes flashColors {
		0% {
			opacity: 0.05;
			background: blue;
		}
		25% {
			opacity: 0.05;
			background: red;
		}
		50% {
			opacity: 0.05;
			background: green;
		}
		75% {
			opacity: 0.05;
			background: yellow;
		}
		100% {
			opacity: 0.05;
			background: blue;
		}
	}
</style>

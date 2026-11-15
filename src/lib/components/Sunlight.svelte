<div class="relative">
	<div class="sunlight-glow pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-linear-to-b from-yellow-200/25 to-transparent"></div>
</div>

<style>
	.sunlight-glow {
		animation: sunlight-dim 5s ease-in-out infinite alternate;
	}

	@keyframes sunlight-dim {
		from {
			opacity: 0.65;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sunlight-glow {
			animation: none;
		}
	}
</style>

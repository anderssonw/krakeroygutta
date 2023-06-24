<script>
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
</script>

{#if !$page.data.session}
	<div class="relative h-60 w-full mt-4 tablet:mt-20 laptop:mt-32">
		<div class="absolute left-0 bottom-0 w-40 tablet:w-2/6">
			<img src="SquadLeft.png" alt="left squad" />
		</div>

		<div class="flex flex-col items-center h-[100%] pt-12 laptop:pt-6 laptop:pt-0">
			<h3>Hvem tar du med deg?</h3>
			<button class="btn" on:click={() => goto("/register")}>
				Kom i gang!
			</button>
		</div>

		<div class="absolute right-0 bottom-0 w-40 tablet:w-2/6">
			<img src="SquadRight.png" alt="right squad" />
		</div>
	</div>
{/if}

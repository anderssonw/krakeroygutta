<script lang="ts">
	import MatchCardTeam from './MatchCardTeam.svelte';

	import ArrowUpIcon from 'virtual:icons/ph/arrow-up';
	import ArrowDownIcon from 'virtual:icons/ph/arrow-down';
	import MatchCardTeamHeader from './MatchCardTeamHeader.svelte';
	import MatchCardVersus from './MatchCardVersus.svelte';
	import type { MatchStatsPlayer, MatchStatsQuery, MatchStatsTeam } from '$lib/types/newTypes';

	export let cardOpen: boolean = false;

	export let match: MatchStatsQuery;

	$: score = getScoreFromMatch(match);

	const getGoalScoreForTeam = (team: MatchStatsTeam): number => {
		return team.players?.reduce((a: number, b: MatchStatsPlayer) => a + b.goals, 0);
	};

	const getScoreFromMatch = (match: MatchStatsQuery) => {
		let homeGoals = getGoalScoreForTeam(match.home_team);
		let awayGoals = getGoalScoreForTeam(match.away_team);

		return `${homeGoals} - ${awayGoals}`;
	};

	function accordion(node: HTMLDivElement, isOpen: boolean) {
		let initialHeight = node.offsetHeight;

		// Høyden her blir feil hvis man endrer fra mobil-bredde til laptopbredde
		node.style.height = isOpen ? 'fit-content' : '0';
		node.style.overflow = 'hidden';
		return {
			update(isOpen: any) {
				let animation = node.animate(
					[
						{
							height: initialHeight + 'px',
							overflow: 'hidden'
						},
						{
							height: 0,
							overflow: 'hidden'
						}
					],
					{ duration: 300, fill: 'both', easing: 'ease-in-out' }
				);
				animation.pause();
				if (!isOpen) {
					animation.play();
				} else {
					animation.reverse();
				}
			}
		};
	}
</script>

<div class="flex flex-col items-center bg-team-white text-black rounded-lg mx-4">
	<div class="flex flex-col p-6 flex-wrap justify-center">
		<div class="flex flex-row flex-wrap justify-center">
			<MatchCardTeamHeader team={match.home_team} />

			<MatchCardVersus {score} />

			<MatchCardTeamHeader team={match.away_team} mirror />
		</div>

		<div class="flex flex-row flex-wrap justify-center" use:accordion={cardOpen}>
			<MatchCardTeam team={match.home_team} />

			<MatchCardTeam team={match.away_team} />
		</div>
	</div>

	<button
		type="button"
		class="flex flex-row w-full text-lg justify-center items-center border-t border-t-gray-200"
		on:click={() => (cardOpen = !cardOpen)}
	>
		{#if cardOpen}
			<ArrowUpIcon class="my-3" />
		{:else}
			<ArrowDownIcon class="my-3" />
		{/if}
	</button>
</div>

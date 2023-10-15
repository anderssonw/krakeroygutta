<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { DropdownOption } from '$lib/types/newTypes';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import DropdownMenu from '$lib/components/admin/dropdownMenu.svelte';
	import type { Tables } from '$lib/types/database.helper.types';

	export let data: PageData;
	// All of this stuff is also in admin/layout, not sure how to copy it over effectively just letting it stay for now

	$: ({ seasons, lazy, players } = data);
	$: seasonOption = null as DropdownOption | null;
	$: setSeasonURL(seasonOption);
	onMount(() => {
		let seasonParamId = Number($page.url.searchParams.get('season'));
		if (seasonParamId) {
			let seasonFromParam = seasons?.find((season) => season.id == seasonParamId);
			if (!seasonFromParam) return;
			seasonOption = {
				id: seasonFromParam.id,
				name: seasonFromParam.name
			};
		}
	});
	const setSeasonURL = (seasonOption: DropdownOption | null) => {
		if (!browser) return;

		let url = $page.url;
		if (seasonOption) {
			let query = new URLSearchParams(url.searchParams.toString());
			query.set('season', `${seasonOption.id}`);
			goto(`?${query.toString()}`);
		} else {
			goto(`${url.origin}${url.pathname}`);
		}
	};
	const getSeasonOptions = () => {
		if (!seasons) return [];
		return seasons?.map((season) => {
			return {
				name: season.name,
				id: season.id
			} satisfies DropdownOption;
		});
	};

	function getTopScorers(goals: Tables<'goals'>[]) {
		let playerGoals: number[] = [];

		goals.forEach((goal) => {
			if (!playerGoals[goal.goal_player_id]) {
				playerGoals[goal.goal_player_id] = 0;
			}

			playerGoals[goal.goal_player_id]++;
		});

		return playerGoals
			.map((goals, index) => {
				let player = players?.find((player) => player.id === index);
				return {
					goals: goals,
					player: {
						name: player?.name
					}
				};
			})
			.sort((a, b) => b.goals - a.goals)
			.slice(0, 3);
	}
	function getTopAssisters(goals: Tables<'goals'>[]) {
		let playerGoals: number[] = [];

		goals.forEach((goal) => {
			if (!playerGoals[goal.assist_player_id]) {
				playerGoals[goal.assist_player_id] = 0;
			}

			playerGoals[goal.assist_player_id]++;
		});

		return playerGoals
			.map((goals, index) => {
				let player = players?.find((player) => player.id === index);
				return {
					assists: goals,
					player: {
						name: player?.name
					}
				};
			})
			.sort((a, b) => b.assists - a.assists)
			.slice(0, 3);
	}

	function getTopClutchers(clutches: Tables<'clutches'>[]) {
		let playerGoals: number[] = [];

		clutches.forEach((clutch) => {
			if (!playerGoals[clutch.player_id]) {
				playerGoals[clutch.player_id] = 0;
			}

			playerGoals[clutch.player_id]++;
		});

		return playerGoals
			.map((clutches, index) => {
				let player = players?.find((player) => player.id === index);
				return {
					clutches,
					player: {
						name: player?.name
					}
				};
			})
			.sort((a, b) => b.clutches - a.clutches)
			.slice(0, 3);
	}

	const getPlayerSelections = (teams: { id: number; players: { player_id: number }[] }[] | never[]) => {
		let playerMap: number[] = [];

		players.forEach((player) => (playerMap[player.id - 1] = 0));

		teams.forEach((team) => {
			team.players.forEach((player) => {
				playerMap[player.player_id - 1]++;
			});
		});

		return playerMap.map((selections, index) => {
			let player = players?.find((player) => player.id === index + 1);

			return {
				selections,
				player: {
					name: player?.name
				}
			};
		});
	};

	function getMostSelectedPlayers(teams: { id: number; players: { player_id: number }[] }[] | never[]) {
		let playerSelections = getPlayerSelections(teams);

		return playerSelections.sort((a, b) => b.selections - a.selections).slice(0, 3);
	}

	function getLeastSelectedPlayers(teams: { id: number; players: { player_id: number }[] }[] | never[]) {
		let playerSelections = getPlayerSelections(teams);

		return playerSelections.sort((a, b) => a.selections - b.selections).slice(0, 3);
	}
</script>

<div class="structure">
	<div class="w-3/5">
		<DropdownMenu header={'Velg Sesong'} option={'sesong'} options={getSeasonOptions()} bind:selectedOption={seasonOption} />
	</div>

	{#if seasonOption}
		<div class="flex flex-col">
			<div class="flex flex-row">
				{#await lazy.fantasyTeamPlayers}
					<!-- promise is pending -->
				{:then players}
					<div>
						<h3>Mest valgte spillere</h3>
						{#each getMostSelectedPlayers(players) as player}
							<div>
								<p>
									Antall valg: {player.selections}
								</p>
								<p>Spiller {player.player.name}</p>
							</div>
						{/each}
					</div>
					<div>
						<h3>Minst valgte spillere</h3>
						{#each getLeastSelectedPlayers(players) as player}
							<div>
								<p>
									Antall valg: {player.selections}
								</p>
								<p>Spiller {player.player.name}</p>
							</div>
						{/each}
					</div>
				{/await}
			</div>
			<div class="flex flex-row">
				{#await lazy.goals}
					<p>Laster mål</p>
				{:then goals}
					<div>
						<h3>Flest mål</h3>
						{#each getTopScorers(goals) as goal}
							<div>
								<p>
									Antall mål: {goal.goals}
								</p>
								<p>Spiller {goal.player.name}</p>
							</div>
						{/each}
					</div>
					<div>
						<h3>Flest assists</h3>
						{#each getTopAssisters(goals) as goal}
							<div>
								<p>
									Antall assists: {goal.assists}
								</p>
								<p>Spiller {goal.player.name}</p>
							</div>
						{/each}
					</div>
				{/await}

				{#await lazy.clutches}
					<p>Laster c-momenter</p>
				{:then clutches}
					<div>
						<h3>Flest c-momenter</h3>
						{#each getTopClutchers(clutches) as goal}
							<div>
								<p>
									Antall c-momenter: {goal.clutches}
								</p>
								<p>Spiller {goal.player.name}</p>
							</div>
						{/each}
					</div>
				{/await}
			</div>
		</div>
	{/if}
</div>

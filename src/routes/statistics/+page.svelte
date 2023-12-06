<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { DropdownOption } from '$lib/types/newTypes';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import DropdownMenu from '$lib/components/admin/dropdownMenu.svelte';
	import type { Tables } from '$lib/types/database.helper.types';

	import PlayerStatisticCard from '$lib/components/statistics/PlayerStatisticCard.svelte';
	import PlayerStatisticCardGroup from '$lib/components/statistics/PlayerStatisticCardGroup.svelte';

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

		let statsSeasons: DropdownOption[] = [];
		seasons?.forEach((season) => {
			if(new Date(season.deadline_time) < new Date()) {
				let opt = {
					name: season.name,
					id: season.id
				} satisfies DropdownOption;
				statsSeasons.push(opt);
			}
		});

		return statsSeasons
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
						name: player?.name,
						image: player?.image
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
						name: player?.name,
						image: player?.image
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
						name: player?.name,
						image: player?.image
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
					name: player?.name,
					image: player?.image
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
	{#if getSeasonOptions().length > 0}
		<div class="w-96">
			<DropdownMenu header={'Velg Sesong'} option={'sesong'} options={getSeasonOptions()} bind:selectedOption={seasonOption} />
		</div>
	{:else}
		<div class="p-8 tablet:p-4 laptop:p-0">
			<h5>Ingen statistikk tilgjengelig. Vent til en aktiv sesong er forbi.</h5>
		</div>
	{/if}

	{#if seasonOption}
		<div class="flex flex-col">
			<div class="flex flex-row flex-wrap">
				{#await lazy.fantasyTeamPlayers}
					<!-- promise is pending -->
				{:then players}
					<PlayerStatisticCardGroup title="Mest valgte spillere 😍🍆💦">
						{#each getMostSelectedPlayers(players) as player, index}
							<PlayerStatisticCard
								playerName={player.player.name}
								playerSubtitle={`Valgt ${player.selections} ${player.selections > 1 ? 'ganger' : 'gang'}`}
								imgSrc={player.player.image}
								imgAlt={player.player.name}
								position={index + 1}
							/>
						{/each}
					</PlayerStatisticCardGroup>
					<PlayerStatisticCardGroup title="Minst valgte spillere 😩😰">
						{#each getLeastSelectedPlayers(players) as player, index}
							<PlayerStatisticCard
								playerName={player.player.name}
								playerSubtitle={`Valgt ${player.selections} ${player.selections === 1 ? 'gang' : 'ganger'}`}
								imgSrc={player.player.image}
								imgAlt={player.player.name}
								position={index + 10}
							/>
						{/each}
					</PlayerStatisticCardGroup>
				{/await}
			</div>
			<div class="flex flex-row flex-wrap">
				{#await lazy.goals}
					<p>Laster mål</p>
				{:then goals}
					<PlayerStatisticCardGroup title="Flest mål">
						{#each getTopScorers(goals) as goal}
							<PlayerStatisticCard
								playerName={goal.player.name}
								playerSubtitle={`Scoret ${goal.goals} ${goal.goals === 1 ? 'gang' : 'ganger'}`}
								imgSrc={goal.player.image}
								imgAlt={goal.player.name}
							/>
						{/each}
					</PlayerStatisticCardGroup>

					<PlayerStatisticCardGroup title="Flest assists">
						{#each getTopAssisters(goals) as goal}
							<PlayerStatisticCard
								playerName={goal.player.name}
								playerSubtitle={`Hadde ${goal.assists} ${goal.assists === 1 ? 'assist' : 'assister'}`}
								imgSrc={goal.player.image}
								imgAlt={goal.player.name}
							/>
						{/each}
					</PlayerStatisticCardGroup>
				{/await}

				{#await lazy.clutches}
					<p>Laster c-momenter</p>
				{:then clutches}
					<PlayerStatisticCardGroup title="Flest c-momenter">
						{#each getTopClutchers(clutches) as clutch}
							<PlayerStatisticCard
								playerName={clutch.player.name}
								playerSubtitle={`Hadde ${clutch.clutches} ${clutch.clutches === 1 ? 'c-moment' : 'c-momenter'}`}
								imgSrc={clutch.player.image}
								imgAlt={clutch.player.name}
							/>
						{/each}
					</PlayerStatisticCardGroup>
				{/await}
			</div>
		</div>
	{/if}
</div>

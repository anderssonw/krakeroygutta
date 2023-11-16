<script lang="ts">
	import type { FantasyForm, FullPlayer } from '$lib/types/newTypes';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import NotCaptainIcon from 'virtual:icons/ic/outline-panorama-photosphere';
	import CaptainIcon from 'virtual:icons/ic/outline-panorama-photosphere-select';
	import UserIcon from 'virtual:icons/ph/user-circle';

	export let player: FullPlayer | null;
	export let fantasyForm: FantasyForm;
	export let position: number;
	export let isSeasonPastDeadline: boolean;

	function handleCaptainClick(playerId: number) {
		fantasyForm.captainId = playerId;
	}

	function sellPlayer() {
		fantasyForm.players[position] = null;
		if (fantasyForm.captainId == player?.player_id) {
			fantasyForm.captainId = -1;
		}
	}

	$: isCaptain = fantasyForm.captainId == player?.player_id;
</script>

{#if !isSeasonPastDeadline}
	<button type="button" class="btn-icon" title="Selg Spiller" on:click={() => sellPlayer()}>
		<DeleteIcon font-size="large" />
	</button>
	<button type="button" title="Velg som Kaptein" class="btn-icon" on:click={() => handleCaptainClick(player?.player_id ?? -1)}>
		{#if isCaptain}
			<CaptainIcon font-size="large" />
		{:else}
			<NotCaptainIcon font-size="large" />
		{/if}
	</button>
{/if}
<a href="/players/{player?.player_id}" target="_blank" rel="noreferrer" class="p-0">
	<button type="button" title="Se Detaljert Spillerstatistikk" class="btn-icon">
		<UserIcon font-size="large" />
	</button>
</a>

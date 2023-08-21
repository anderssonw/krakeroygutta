<script lang="ts">
	import { page } from '$app/stores';
	import SpinnerIcon from '$lib/shared/spinnerIcon.svelte';
	import type { CreateFantasy, Fantasy, FantasyForm, Player, Season, UserClient } from '$lib/types/newTypes';
	import CardSmall from '../fantasy/CardSmall.svelte';
	import SelectCardModal from './SelectCardModal.svelte';
	import { onMount } from 'svelte';

	export let activeSeason: Season | null;
	export let players: Player[];
	export let fantasy: Fantasy | null;
</script>

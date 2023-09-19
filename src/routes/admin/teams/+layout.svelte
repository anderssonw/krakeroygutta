<script lang="ts">
	import DropdownMenu from '$lib/components/admin/dropdownMenu.svelte';
	import type { DropdownOption } from '$lib/types/newTypes';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: LayoutData;

	$: ({ seasons } = data);

	$: seasonOption = {} as DropdownOption;

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

	const setSeasonURL = (seasonOption: DropdownOption) => {
		// TODO this does not remove the query param when removing the seasonOption
		if (seasonOption.id) {
			let routeWithParam = `${$page.url.pathname}?season=${seasonOption.id}`;

			goto(routeWithParam);
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
</script>

<div class="structure">
	<h2>Lagadministrasjon</h2>

	<div class="w-3/5">
		<DropdownMenu header={'Velg Sesong'} option={'sesong'} options={getSeasonOptions()} bind:selectedOption={seasonOption} />
	</div>
	{#if seasonOption.id}
		<slot />
	{/if}
</div>

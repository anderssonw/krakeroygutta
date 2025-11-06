<script lang="ts">
	import DropdownMenu from '$lib/components/admin/dropdownMenu.svelte';
	import type { DropdownOption } from '$lib/types/newTypes';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import ReturnToRoute from '$lib/components/common/ReturnToRoute.svelte';

	export let data: LayoutData;
	$: ({ seasons, season } = data);
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
		} else {
			if (season) {
				seasonOption = {
					id: season.id,
					name: season.name
				};
			}
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
</script>

<div class="flex flex-col gap-4 items-center w-full">
	<div class="w-full laptop:w-1/2">
		<DropdownMenu header={'Velg Sesong'} option={'sesong'} options={getSeasonOptions()} bind:selectedOption={seasonOption} />
	</div>

	{#if seasonOption}
		<slot />
	{/if}
</div>

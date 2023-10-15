<script lang="ts">
	import { goto } from '$app/navigation';
	import ArrowLeftIcon from 'virtual:icons/ph/arrow-left';

	/**
	 * The route in which to return the user to when clicking this component
	 */
	export let route: string;

	/**
	 * The text the is displayed as helper text for interacting with the component
	 */
	export let text: string;
</script>

<button class="flex items-center" type="button" on:click={() => goto(route)}>
	<ArrowLeftIcon />
	<p class="ml-2">{text}</p>
</button>

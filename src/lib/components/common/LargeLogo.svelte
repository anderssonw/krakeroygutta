<script lang="ts">
	import headerLarge from '$lib/assets/headerLarge.png';
	import headerLargeDiscoGif from '$lib/assets/headerLargeDiscoDone.gif';
</script>

<div class="w-[90%] sm:w-[80%]">
	<picture>
		<source srcset={headerLargeDiscoGif} type="image/gif" />
		<img src={headerLarge} alt="logo" />
	</picture>
</div>

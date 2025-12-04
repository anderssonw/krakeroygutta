<script lang="ts">
	import headerLarge from '$lib/assets/headerLarge.png';
	import headerLargeDisco from '$lib/assets/headerLargeDisco.webp';
	import headerLargeDiscoLowres from '$lib/assets/headerLargeDiscoLowres.webp';
</script>

<div class="px-4 block tablet:hidden">
	<picture>
		<source srcset={headerLargeDiscoLowres} type="image/webp" />
		<img src={headerLarge} alt="logo" />
	</picture>
</div>

<div class="w-[90%] sm:w-[80%] hidden tablet:block">
	<picture>
		<source srcset={headerLargeDisco} type="image/webp" />
		<img src={headerLarge} alt="logo" />
	</picture>
</div>

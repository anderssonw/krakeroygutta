<script lang="ts">
	import headerLarge from '$lib/assets/headerLarge.png';
	import headerLargeDisco from '$lib/assets/headerLargeDisco.webp';
</script>

<div class="w-[90%] sm:w-[80%]">
	<picture>
		<source srcset={headerLargeDisco} type="image/webp" />
		<img src={headerLarge} alt="logo" />
	</picture>
</div>

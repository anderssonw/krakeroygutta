<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="structure">
	<h1>Det ser ut som noe har gått galt med siden!</h1>

	<h2>
		Oss stakkars utviklere av siden kan alltids gjøre feil, så for å hjelpe oss gjøre siden bedre kan du ta skjermbilde av meldingen under:
	</h2>

	<h3>{$page.error?.devHelper}</h3>

	<h3>{$page.error?.message}</h3>
</div>

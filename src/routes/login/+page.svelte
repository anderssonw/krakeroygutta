<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<form class="form" method="POST">
	<div
		id="g_id_onload"
		data-client_id="265486719809-3b4temsg3nvkhdu5g5ikn7npliv3lv3g.apps.googleusercontent.com"
		data-context="signin"
		data-ux_mode="popup"
		data-login_uri="/login"
		data-auto_prompt="false"
	></div>

	<div
		class="g_id_signin"
		data-type="standard"
		data-shape="pill"
		data-theme="outline"
		data-text="signin_with"
		data-size="large"
		data-logo_alignment="left"
	></div>
</form>

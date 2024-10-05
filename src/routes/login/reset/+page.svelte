<script lang="ts">
	let email: string;

	let loading = false;
</script>

<div class="structure">
	<h3>Glemt passord?</h3>

	<p>For å resette passordet ditt, skriv e-posten din her så vil du få en lenke for å resette hvis e-posten din faktisk er registrert</p>
	<form class="form" method="POST">
		<div class="form-structure">
			<div class="w-full">
				<label for="email" class="block mb-1"><h5>Epost</h5></label>
				<input name="email" type="email" id="email" class="input w-full" placeholder="næbb@næbbesen.no" bind:value={email} required />
			</div>
			<div>
				<button class="btn">{loading ? 'Laster' : 'Resett passord'}</button>
			</div>
		</div>
	</form>
</div>

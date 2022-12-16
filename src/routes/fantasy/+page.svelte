<script>
	let form = {
		teamName: '',
		playerChoices: []
	};

	const budget = 17500;

	const players = [
		{
			name: 'William',
			price: 3200
		},
		{
			name: 'Magnus',
			price: 6500
		},
		{
			name: 'Mads',
			price: 4200
		},
		{
			name: 'Ask',
			price: 3800
		}
	];

	$: notChosenPlayers = (extraPlayer) => {
		let newPlayers = players.filter((player) => {
			{
				let playerIfExists = form.playerChoices.find(
					(chosenPlayer) => chosenPlayer.name == player.name
				);

				if (playerIfExists) return false;

				return true;
			}
		});

		if (extraPlayer) newPlayers.push(extraPlayer);

		return newPlayers;
	};

	$: restBudget = () => {
		let total = 0;
		form.playerChoices
			.filter((player) => player.name)
			.forEach((player) => {
				total += player.price;
			});
		return budget - total;
	};

	function submitForm() {
		console.log(form);
	}
</script>

<main class="content">
	<h3>Velkommen til Fantasy!</h3>
	<p>
		Hei! Og velkommen til denne testen av Fantasy Julebord. På denne siden kan du sette opp fire
		spillere til ditt Fantasy Julebord-lag. Poenggivning til spillerne vil i stor grad følge reglene
		som brukes hos vår hovedkonkurrent, Fantasy Premier League. Deadline: kl 12 lørdag 17.12.
		Vinneren vil kåres senere på samme dag. Lykke til og god jul!
	</p>
	<table class="playerTable">
		<thead>
			<th>Spiller</th>
			<th>Pris</th>
			{#each players.sort((a, b) => b.price - a.price) as player}
				<tr>
					<td> {player.name} </td>
					<td> {player.price} </td>
				</tr>
			{/each}
		</thead>
	</table>

	<p>Totalbudsjett: {budget}</p>
	<p>Gjenværende budsjett: {restBudget()}</p>
	<form class="form" on:submit|preventDefault={submitForm}>
		<label for="teamName">Lagnavn</label>
		<input type="text" name="teamName" bind:value={form.teamName} />
		{#each [...Array(4).keys()] as index}
			<label for={'player-' + index}>Spillervalg {index + 1}</label>
			<select
				name={'player-' + index}
				id={'player-' + index}
				bind:value={form.playerChoices[index]}
			>
				<option value selected default disabled>Velg Spiller</option>
				{#each notChosenPlayers(form.playerChoices[index]) as player}
					<option value={player}>{player.name}</option>
				{/each}
			</select>
		{/each}
		<button type="submit">Send Inn</button>
	</form>
</main>

<style>
	.content {
		padding: 0 16vh 0 16vh;
		text-align: center;
	}

	.playerTable {
		display: flex;
		justify-content: center;
	}

	.form {
		display: flex;
		flex-direction: column;
		padding: 0 16vh 0 16vh;
	}
</style>

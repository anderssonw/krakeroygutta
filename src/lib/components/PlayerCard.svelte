<script lang="ts">
	export let name: string;
	export let price: number;
	export let imageUrl: string = 'https://img.freepik.com/free-icon/user_318-864557.jpg?w=2000';
</script>

<div class="card">
	<img class="image" src={imageUrl} alt={name} />
	<div class="name">{name}</div>
	<div class="subtext">{price}</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 0.5rem;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		padding: 8px;
	}

	.image {
		grid-column: 1 / 3;
		grid-row: 1 / 2;
		height: 8em;
		object-fit: cover;
		transition: all 0.2s ease-in-out;
	}

	.name {
		font-size: 0.75rem;
		font-weight: bold;
	}

	.subtext {
		font-size: 1rem;
		color: gray;
	}

	.card:hover {
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
		transform: scale(1.05);
	}

	.card:hover .image {
		transform: scale(1);
		width: 100%;
	}
</style>

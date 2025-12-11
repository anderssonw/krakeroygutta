<script lang="ts">
	type PlayerWithStats = {
		player_id: number;
		name: string;
		image: string;
		inform_image: string;

		attack: number;
		defence: number;
		morale: number;
		physical: number;
		skill: number;
		price: number | null;
	};

	interface Props {
		player: PlayerWithStats;
		size: 'sm' | 'md' | 'lg';
	}
</script>

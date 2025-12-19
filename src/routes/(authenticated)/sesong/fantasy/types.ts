type FantasyTeam = {
	id: number;
	name: string;
	playersIds: number[];
	captainPlayerId: number | null;
};

// Samme som over, men for form, hvor id kan være null for nytt lag
type FantasyForm = {
	id: number | null;
	name: string;
	playerIds: number[];
	captainPlayerId: number | null;
};

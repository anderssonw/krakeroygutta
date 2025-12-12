import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const TEAM_SIZE = 4;

export type FantasyValidationError = 'incomplete_team' | 'over_budget' | 'missing_name' | 'no_captain';

export type ValidationError = {
	error: FantasyValidationError;
	message: string;
};

// Validation error messages
export const VALIDATION_MESSAGES = {
	MISSING_NAME: 'Gi laget ditt et navn',
	TEAM_SIZE_REQUIRED: (count: number) => `Du må velge ${count} spillere`,
	NO_CAPTAIN: 'Velg en kaptein for laget ditt',
	INCOMPLETE_TEAM: (remaining: number) => `Velg ${remaining} spiller${remaining !== 1 ? 'e' : ''} til`,
	OVER_BUDGET: (amount: number) => `Du har overskredet budsjettet med ${Math.abs(amount)}`
} as const;

// Zod schema for fantasy team form data
export const fantasyTeamFormSchema = zfd.formData({
	teamId: zfd.numeric(z.number().optional()),
	teamName: zfd.text(z.string().min(1, VALIDATION_MESSAGES.MISSING_NAME).trim()),
	playerIds: zfd.repeatable(z.array(zfd.numeric()).length(TEAM_SIZE, VALIDATION_MESSAGES.TEAM_SIZE_REQUIRED(TEAM_SIZE))),
	captainId: zfd.numeric(z.number({ message: VALIDATION_MESSAGES.NO_CAPTAIN }))
});

export type FantasyTeamFormData = z.infer<typeof fantasyTeamFormSchema>;

export type FantasyTeamData = {
	name: string;
	playerIds: number[];
	captainPlayerId: number | null;
	remainingCash: number;
};

export function validateFantasyTeam(data: FantasyTeamData): ValidationError | null {
	// Check team size first
	if (data.playerIds.length !== TEAM_SIZE) {
		const remaining = TEAM_SIZE - data.playerIds.length;
		return {
			error: 'incomplete_team',
			message: VALIDATION_MESSAGES.INCOMPLETE_TEAM(remaining)
		};
	}

	// Check budget
	if (data.remainingCash < 0) {
		return {
			error: 'over_budget',
			message: VALIDATION_MESSAGES.OVER_BUDGET(data.remainingCash)
		};
	}

	// Check team name
	if (!data.name || data.name.trim() === '') {
		return {
			error: 'missing_name',
			message: VALIDATION_MESSAGES.MISSING_NAME
		};
	}

	if (data.captainPlayerId === null) {
		return {
			error: 'no_captain',
			message: VALIDATION_MESSAGES.NO_CAPTAIN
		};
	}

	return null;
}

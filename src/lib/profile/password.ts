export const passwordErrors = (password: string | null | undefined): Record<string, string> => {
	const errors: Record<string, string> = {};

	if (password == null || password === '') {
		errors.missing = 'Passord kan ikke være tomt';
	}

	if (password != null && password.length < 8) {
		errors.length = 'Passord må være minst 8 bokstaver langt';
	}

	return errors;
};

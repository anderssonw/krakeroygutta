export const getLastName = (fullName: string): string => {
	if (fullName === 'Eilif Fagerli-Wilhelmsen') return 'Wilhelmsen';

	const nameParts = fullName.trim().split(' ');

	return nameParts.slice(-1)[0];
};

export const getInitials = (fullName: string): string => {
	const nameParts = fullName.trim().split(' ');

	const namePartsInitials = nameParts.map((part) => part.charAt(0).toUpperCase());

	const first = namePartsInitials[0];

	const last = namePartsInitials.slice(-1)[0];

	return `${first}. ${last}.`;
};

export const getNamesExceptFirst = (fullName: string): string => {
	const parts = fullName.trim().split(' ');

	if (parts.length <= 1) {
		return fullName;
	}

	return parts.slice(1).join(' ');
};

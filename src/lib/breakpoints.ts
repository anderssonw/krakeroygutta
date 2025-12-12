export type BreakPoint = 'sm' | 'md' | 'lg';

export const getCurrentBreakpoint = (): BreakPoint => {
	if (typeof window === 'undefined') {
		return 'lg'; // Default to 'lg' on server-side, shouldn't be used on server though.
	}

	const width = window.innerWidth;

	if (width < 640) return 'sm';
	if (width >= 640 && width < 768) return 'md';

	return 'lg';
};

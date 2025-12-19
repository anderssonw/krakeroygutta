export function accordion(node: HTMLDivElement, isOpen: boolean) {
	let initialHeight = node.offsetHeight;

	// Høyden her blir feil hvis man endrer fra mobil-bredde til laptopbredde
	node.style.height = isOpen ? 'fit-content' : '0';
	node.style.overflow = 'hidden';
	return {
		update(isOpen: any) {
			let animation = node.animate(
				[
					{
						height: initialHeight + 'px',
						overflow: 'hidden'
					},
					{
						height: 0,
						overflow: 'hidden'
					}
				],
				{ duration: 300, fill: 'both', easing: 'ease-in-out' }
			);
			animation.pause();
			if (!isOpen) {
				animation.play();
			} else {
				animation.reverse();
			}
		}
	};
}

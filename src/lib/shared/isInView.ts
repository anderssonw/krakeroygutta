// Function to check if the element is in view
export function isInViewport(element: any) {
    const extendBorder = 200; // Pixels to see image earlier / stay for longer
    return (
        element.top >= 0 - extendBorder &&
        element.left >= 0 &&
        element.bottom <=
            (window.innerHeight + extendBorder ||
            document.documentElement.clientHeight + extendBorder) &&
        element.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    );
}
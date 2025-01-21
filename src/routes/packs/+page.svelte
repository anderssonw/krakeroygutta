
<script lang="ts">
	import { onMount } from 'svelte';
	import 'animate.css';

    const addClassesToElement = (element: HTMLElement, classes: string[]) => {
        element.classList.add('animate__animated', ...classes);
    }

    const addOnClick = (element: HTMLElement | null, classes: string[]) => {
        if (element) {
            element.onclick = function() {
                addClassesToElement(element, classes);
            };
        }
    }

    const addOnEnd = (element: HTMLElement | null, classes: string[]) => {
        if (element) {
            element.addEventListener('animationend', () => {
                addClassesToElement(element, classes);
            });
        }
    }

    onMount(() => {
        const card = document.getElementById('card');
        addOnClick(card, ['animate__flash', 'animate__fast']);
        addOnEnd(card, ['animate__zoomOut', 'animate__delay-1s', 'animate__slow']);

        const card_row = document.getElementById('card-row');
        if (card_row) {
            card_row.childNodes.forEach((child) => {
                if (child instanceof HTMLElement) {
                    // addClassesToElement(child, ['animate__backInLeft']);
                }
            })
        }
    })
</script>

<div class="structure">
   <div id='card'>
        <div class="w-60 h-80 bg-secondary-color-light hover:bg-secondary-color active:bg-secondary-color-dark active:scale-[98%]">
        </div>
   </div>

   <div id='card-row' class="flex flex-row align-center gap-4">
        <div class="w-40 h-60 bg-primary-color-light rounded-lg hover:scale-[102%] border-4 border-tertiary-color-dark p-2">
            <div class="bg-secondary-color h-[80%] rounded"></div>
        </div>
    </div>
</div>

<nav class="navBar">
	<a href="/">Hjem</a>
	<a href="/fantasy">Fantasy</a>
</nav>
<p class="importantMessage">Jørgen er fet</p>
<slot />

<style>
	.navBar {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.importantMessage {
		position: fixed;
		bottom: 0;
		right: 10px;
		font-size: xx-small;
		opacity: 40%;
	}
</style>

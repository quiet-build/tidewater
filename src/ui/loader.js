export const loaderMarkup = assetBase => `
	<div id="loader" role="status" aria-live="polite" aria-label="Loading Tidewater">
		<img class="loader-art" src="${assetBase}ui/keyart-720.jpg" srcset="${assetBase}ui/keyart-720.jpg 1280w, ${assetBase}ui/keyart.jpg 2560w" sizes="100vw" alt="" decoding="async" fetchpriority="high" />
		<div class="loader-scrim"></div>
		<div class="loader-inner">
			<div class="loader-brand">
				<p class="loader-kicker">An island fishing game</p>
				<h1 class="loader-title">TIDEWATER</h1>
				<p class="loader-tagline">Take the boat out, work the reef and the deep water, and sell your catch to Joe before dark.</p>
			</div>
			<div class="loader-panel">
				<div class="loader-row">
					<span class="loader-status">Starting…</span>
					<span class="loader-meta"><span class="loader-pct">0%</span><span class="loader-time">0:00</span></span>
				</div>
				<div class="loader-bar"><div class="loader-fill"></div><div class="loader-glint"></div></div>
				<div class="loader-note">The first launch compiles the shaders and can take a minute or two. Later visits load much faster.</div>
				<div class="loader-tips">
					<span class="loader-tip-label">Tip</span>
					<div class="loader-tip-list">
						<p class="loader-tip">Press <kbd>R</kbd> for the rod. Hold the left mouse button to wind up, release to cast: the longer you hold, the farther it goes.</p>
						<p class="loader-tip">Watch the bobber. A few nibbles, then it's pulled under: click the left mouse button that moment to set the hook.</p>
						<p class="loader-tip">In a fight, hold to reel but keep the line tension in the green. Ease off when the fish runs, or the line snaps.</p>
						<p class="loader-tip">What bites depends on where you fish: the shallows, the reef, the deep water past the drop-off, and the time of day.</p>
						<p class="loader-tip">Joe at the fish stand by the pier buys your catch. Fish are worth more by weight, so bring the big ones in.</p>
						<p class="loader-tip">Marta at the boathouse sells upgrades: stronger line, a faster reel, a bigger hold, more fuel and a fish finder.</p>
						<p class="loader-tip">Press <kbd>E</kbd> at the boat to board, at the wheel to take the helm, and again to step away and walk the deck.</p>
						<p class="loader-tip">Press <kbd>I</kbd> for your cooler and the fish log. Deck lights from Marta let you fish after dark.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
`;

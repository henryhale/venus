// generate timestamp
const timestamp = () => {
	return Date.now ? Date.now() : new Date().getTime();
};

// frames per second
const FPS = 60;

/**
 * Loop: An approach for creating efficient and cancellable animations 
 */
export function createLoop(
	render: () => void,
	update: (dt: number) => void,
	fps = FPS
) {
	let handle: number;
	let status: boolean;

	function $start() {
		if (handle) $stop();
		status = true;
		frame();
	}

	function $stop() {
		status = false;
		if (handle) window.cancelAnimationFrame(handle);
	}

	const step = 1 / fps;

	let now: number,
		last = timestamp(),
		dt = 0,
		gdt = 0;

	function frame() {
		if (!status) return $stop();
		now = timestamp();
		dt = Math.min(1, (now - last) / 1000);
		gdt += dt;
		while (gdt > step) {
			gdt -= step;
			update(step);
		}
		render();
		last = now;
		handle = window.requestAnimationFrame(frame);
	}

	handle = window.requestAnimationFrame(frame);

	return {
		start: $start,
		stop: $stop
	};
}

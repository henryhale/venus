import "./style.css";

import { CANVAS_HEIGHT, CANVAS_WIDTH, CTX_ERROR, MAX_SPECIES_POPULATION, PREDATOR_MAX_AGE, PREY_MAX_AGE } from "./constants";
import { createLoop, createStats, drawGrid, randomLocation } from "./helpers";
import Predator from "./models/predator";
import Prey from "./models/prey";

// Reference to canvas element
const canvas = document.querySelector("canvas#world") as HTMLCanvasElement;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// 2D canvas rendering context
const ctx = canvas.getContext("2d");
if (!ctx) console.error(CTX_ERROR);

// Initial population
const PREDATOR_COUNT = 15;
const PREY_COUNT = 40;

// Species: Predators
const predators: Predator[] = [];

// Species: Prey
const prey: Prey[] = [];

// Show grid flag
let showGrid = false;

// Build population
function initFamilies(x = PREY_COUNT, y = PREDATOR_COUNT) {
    prey.splice(0);
    for (let i = 0; i < x; i++) {
        const { x, y } = randomLocation();
        prey.push(new Prey(x, y));
    }

    predators.splice(0);
    for (let i = 0; i < y; i++) {
        const { x, y } = randomLocation();
        predators.push(new Predator(x, y));
    }
}

// Stats
const statsCanvas = document.querySelector("canvas#stats");
const stats = createStats(statsCanvas as HTMLCanvasElement);

// statistics
stats.addPlot({
    name: "Predators",
    color: "#FF1414",
}, (height: number) => height - predators.length);

stats.addPlot({
    name: "Prey",
    color: "#19F824",
}, (height) => height - prey.length);

// Create world loop
const game = createLoop(render, update);

// Stop before the page unloads
window.onbeforeunload = game.stop.bind(game);

// World renderer
function render() {
    if (!ctx) return;
    // display current statistics
    stats.render(showGrid);
    // clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // draw grid in dev mode
    if (showGrid) drawGrid(ctx);
    // draw all species
    prey.forEach(p => p.render(ctx));
    predators.forEach(p => p.render(ctx));
}

// World update handler
function update(dt: number) {
    // update statistics graph
    stats.update(dt);

    // remove old age agents
    const $prey = prey.filter(p => p.age < 1.25 * PREY_MAX_AGE);
    const $predators = predators.filter(p => p.age < 1.25 * PREDATOR_MAX_AGE);

    $prey.forEach(p => {
        p.update(dt);
        p.evade($predators);
        p.reproduce($prey);
    });

    $predators.forEach(p => {
        p.update(dt);
        p.hunt($prey);
        p.reproduce($predators);
    });

    prey.splice(0);
    predators.splice(0);

    prey.splice(0, 0, ...$prey);
    predators.splice(0, 0, ...$predators);

    // terminate when either prey or predators go extinct or incase of large population
    if (!prey.length || !predators.length || prey.length > MAX_SPECIES_POPULATION) {
        stopBtn.click();
    }
}

// Setup Controls
const playBtn = document.querySelector("button#start") as HTMLButtonElement;
const stopBtn = document.querySelector("button#stop") as HTMLButtonElement;
const resetBtn = document.querySelector("button#reset") as HTMLButtonElement;
const gridBtn = document.querySelector("button#grid") as HTMLButtonElement;

gridBtn.addEventListener("click", () => {
    showGrid = !showGrid;
});

playBtn.addEventListener("click", () => {
    playBtn.setAttribute("disabled", "true");
    stopBtn.removeAttribute("disabled");
    game.start();
});

stopBtn.addEventListener("click", () => {
    stopBtn.setAttribute("disabled", "true");
    playBtn.removeAttribute("disabled");
    game.stop();
});

resetBtn.addEventListener("click", () => {
    stopBtn.click();
    stats.reset();
    initFamilies();
    playBtn.click();
});

// Start the world...
window.onload = () => resetBtn.click();
window.onbeforeunload = () => stopBtn.click();
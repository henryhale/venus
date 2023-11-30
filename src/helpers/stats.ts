import Graph from "../models/graph";
import type { ValueGenerator } from "../interface";
import { CANVAS_HEIGHT, CANVAS_WIDTH, CTX_ERROR } from "../constants";
import { drawGrid } from "./grid";

export function createStats(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    if (ctx == null) console.error(CTX_ERROR);

    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT / 5;

    canvas.height = height;
    canvas.width = width;

    let time = 0;

    const plots: Graph[] = [];

    function addPlot(config = {}, generator: ValueGenerator) {
        if (typeof config == "object" && config != null) {
            const graph = new Graph(config, generator);
            graph.height = height;
            graph.limit = 0.8 * width;
            graph.unit = 2.5;
            plots.push(graph);
        }
    };

    function render(grid = false) {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        if (grid) drawGrid(ctx, width, height);

        plots.forEach((plot, i) => {
            plot.render(ctx, (i * 20) + 15)
        });

        ctx.font = "0.75rem serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(" T = " + time.toFixed(3) + "s", 0, 20);
    }

    function update(dt: number) {
        time += dt;
        plots.forEach(plot => plot.update(dt));
    }

    function reset() {
        time = 0;
        plots.forEach(plot => {
            plot.points = [];
        });
    }

    return { addPlot, render, update, reset };
}
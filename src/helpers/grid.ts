import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";

const
    majorLine = 50,
    minorLine = 10,
    textColor = "#009900",
    lineColor = "#00FF00";

/**
 * Draws a grid with major lines at intervals of 50
 */
export function drawGrid(ctx: CanvasRenderingContext2D, w = CANVAS_WIDTH, h = CANVAS_HEIGHT) {
    ctx.save();

    ctx.strokeStyle = lineColor;
    ctx.fillStyle = textColor;

    // horizontal
    for (let i = 0; i < w; i += minorLine) {
        // line
        ctx.save();
        ctx.lineWidth = i % majorLine == 0 ? 0.5 : 0.25;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
        ctx.restore();
    }

    // vertical
    for (let j = 0; j < h; j += minorLine) {
        // line
        ctx.save();
        ctx.lineWidth = j % majorLine == 0 ? 0.5 : 0.25;
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
        ctx.restore();
    }

    ctx.restore();
};
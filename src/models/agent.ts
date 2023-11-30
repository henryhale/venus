import { MAX_HEIGHT, MAX_SIZE, TRANSLUCENCY } from "../constants";
import { randomFieldViewAngle, wrapAroundBoundary } from "../helpers";
import type { Animal, Point } from "../interface";

/**
 * Entity: Agent
 */
export default class Agent implements Animal {
    x: number;
    y: number;
    angle: number;
    velocity: number;
    age: number;
    size: number;
    height: number;
    skinColor!: string;
    hairColor!: string;
    opacity: number;
    target?: Point;
    energy: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.velocity = 0;
        this.age = 0;
        this.size = MAX_SIZE;
        this.height = MAX_HEIGHT;
        this.opacity = 1;
        this.energy = 0;
    }

    /**
     * Sets the location to which the agent is heading
     */
    protected setTarget(x?: number, y?: number) {
        if (!y || !x) {
            const distance = Math.random() * this.height + this.size;
            const angle = randomFieldViewAngle(this.angle);
            x = this.x + distance * Math.cos(angle);
            y = this.y + distance * Math.sin(angle);
        }
        this.target = { x, y };
        wrapAroundBoundary(this.target);
    }

    /**
     * Add the movement effect
     */
    protected updateBody(dt: number) {
        if (this.height > MAX_HEIGHT) {
            this.height -= dt * MAX_HEIGHT;
            this.size += 0.25 * dt * MAX_SIZE;
        } else {
            this.height = 1.5 * MAX_HEIGHT;
            this.size = MAX_SIZE;
        }
    }

    /**
     * Manage the target:
     *  - if there exist a target, agent turn to the target
     *  - if target is reached, reset target
     */
    protected updateTarget() {
        if (!this.target) return this.setTarget();
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const d = Math.floor(Math.sqrt(dx * dx + dy * dy));
        if (d != 0) {
            this.angle = Math.atan2(dy, dx);
        } else {
            this.target = undefined;
        }
    }

    /**
     * Update the position of the agent
     *  - reset the target on reaching the boundary 
     */
    protected move(dt: number) {
        const dx = this.velocity * Math.cos(this.angle) * dt;
        const dy = this.velocity * Math.sin(this.angle) * dt;
        this.x = isNaN(dx) ? this.x : this.x + dx;
        this.y = isNaN(dy) ? this.y : this.y + dy;
        if (wrapAroundBoundary(this)) {
            this.target = undefined;
        }
    }

    /**
     * The agent grows old on each tick
     */
    public update(dt: number) {
        this.age += dt;
    }

    /**
     * Draw the agent to the world context
     */
    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.x, -this.y);

        ctx.fillStyle = this.skinColor;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = TRANSLUCENCY;
        ctx.shadowColor = this.hairColor;

        // body
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.height, this.size, 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.hairColor;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";

        const ex = this.x + this.height * 0.75;
        const ey1 = this.y - this.size / 1.5;
        const ey2 = this.y + this.size / 1.5;
        const eye = this.size / 3;

        // eyes
        ctx.beginPath();
        ctx.arc(ex, ey1, eye, 0, 2 * Math.PI);
        ctx.arc(ex, ey2, eye, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
    }
}

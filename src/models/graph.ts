import type { GraphOptions, Point, ValueGenerator } from "../interface";


const DEFAULT_COLOR = "gray";
const LINE_WIDTH = 0.75;
const LINE_JOIN = "round";

export default class Graph implements GraphOptions {
    name: string;
    points: Point[];
    color: string;
    generator: ValueGenerator;

    height!: number;
    unit!: number;
    limit!: number;

    static id: number = 0;

    constructor(options: Partial<GraphOptions>, generator: ValueGenerator) {
        Graph.id++;
        this.name = options.name || ("Graph" + Graph.id);
        this.color = options.color || DEFAULT_COLOR;
        this.points = options.points || [];
        this.generator = generator;
    }

    private get last(): Point | undefined {
        return this.points.at(-1);
    }

    private get first(): Point | undefined {
        return this.points.at(0);
    }

    public update(dt: number) {
        let h = this.height;
        if (typeof this.generator == "function") {
            h = this.generator(this.height, dt) ?? h;
        }
        this.points.push({
            x: (this.last?.x ?? -this.unit) + this.unit,
            y: h
        });
        if (this.points.length >= this.limit / this.unit) {
            this.points.shift();
            this.points.forEach(p => p.x -= this.unit);
        }
    }

    public render(ctx: CanvasRenderingContext2D, py: number) {
        ctx.save();
        ctx.lineCap = LINE_JOIN;
        ctx.lineJoin = LINE_JOIN;
        ctx.lineWidth = LINE_WIDTH;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.first?.x ?? 0, this.first?.y ?? this.height);
        for (const point of this.points) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.last?.x ?? 0, this.last?.y ?? this.height, 1.5 * this.unit, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.font = "0.75rem sans-serif";
        ctx.fillStyle = this.color;
        ctx.fillText(`${this.name} : ${this.height - (this.last?.y ?? this.height)}`, this.limit, py, 100);
        ctx.restore();
    }
}
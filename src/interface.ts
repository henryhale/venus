// Coordinate
export type Point = {
    x: number;
    y: number;
};

// Entity: Agent
export interface Animal extends Point {
    angle: number;
    velocity: number;
    age: number;
    size: number;
    height: number;
    skinColor: string;
    hairColor: string;
    opacity: number;
    target?: Point;
    energy: number;
    render(ctx: CanvasRenderingContext2D): void;
    update(dt: number): void;
};

// Species: Predator
export interface IPredator extends Animal {
    isEating: boolean;
    count: number;
    digestion: number;
    hunt(prey: IPrey[]): void;
    reproduce(group: IPredator[]): void;
}

// Species: Prey
export interface IPrey extends Animal {
    canMove: boolean;
    evade(predators: IPredator[]): void;
    reproduce(group: IPrey[]): void;
}

// Stats: Graph
export type ValueGenerator = (height: number, dt: number) => number;

export type GraphOptions = {
    name: string;
    color: string;
    points: Point[];
};


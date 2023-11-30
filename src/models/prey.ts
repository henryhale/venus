import { ENERGY_LOSS_RATE, MAX_CHILDREN, MAX_ENERGY_LEVEL, MIN_ENERGY_LEVEL, PREY_ENERGY_GAIN, PREY_MATURITY_AGE_FACTOR, PREY_MAX_AGE, PREY_RANDOM_MOVEMENT_CHANCE, PREY_SPEED, REPRODUCITON_THRESHOLD } from "../constants";
import { randomFieldViewAngle } from "../helpers";
import type { IPredator, IPrey } from "../interface";
import Agent from "./agent";

export default class Prey extends Agent implements IPrey {
    canMove: boolean;

    constructor(x: number, y: number) {
        super(x, y);
        this.skinColor = "#19F824";
        this.hairColor = "#20C728";
        this.velocity = PREY_SPEED;
        this.energy = MAX_ENERGY_LEVEL;
        this.canMove = false;
    }

    public update(dt: number): void {
        super.update(dt);
        if (this.age > PREY_MAX_AGE) {
            this.opacity = Math.min(1, PREY_MAX_AGE / (4 * this.age));
            return;
        };
        if (this.canMove || Math.random() > PREY_RANDOM_MOVEMENT_CHANCE) {
            if (this.energy) {
                this.updateBody(dt);
                this.updateTarget();
                this.move(dt);
                this.energy = Math.max(this.energy - ENERGY_LOSS_RATE, MIN_ENERGY_LEVEL);
            }
        } else {
            this.energy = Math.min(this.energy + PREY_ENERGY_GAIN, MAX_ENERGY_LEVEL);
        }
    }

    /**
     * Avoid predators
     */
    public evade(predators: IPredator[]): void {
        let flag = false;
        predators.forEach((predator) => {
            const dx = predator.x - this.x;
            const dy = predator.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 4 * (predator.size + this.size)) {
                this.target = undefined;
                this.angle = predator.angle;
                flag = true;
            }
        });
        this.canMove = flag;
    }

    private hasReproduced = false;

    /**
     * Give birth to kids in favorable conditions
     */
    public reproduce<IPrey>(prey: IPrey[]): void {
        if (this.hasReproduced) return;
        if (this.energy >= REPRODUCITON_THRESHOLD && this.age >= PREY_MATURITY_AGE_FACTOR * PREY_MAX_AGE) {
            // produce descendants -> random number
            const num = Math.max(1, Math.floor(Math.random() * MAX_CHILDREN));
            // make babies :)
            const descendants: IPrey[] = new Array(num).fill(null).map((_) => {
                const child = new Prey(this.x, this.y);
                child.energy = REPRODUCITON_THRESHOLD;
                child.angle = randomFieldViewAngle(this.angle);
                child.setTarget();
                return child as IPrey;
            });
            // add them to the world
            prey.push(...descendants);
            // no more babies :)
            this.hasReproduced = true;
        }
    }
}
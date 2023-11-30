import { ATTACK_PERIMETER_FACTOR, DIGESTION_TIME, ENERGY_LOSS_RATE, MAX_CHILDREN, MAX_ENERGY_LEVEL, MAX_HEIGHT, MAX_SIZE, MIN_ENERGY_LEVEL, PREDATOR_MATURITY_AGE_FACTOR, PREDATOR_MAX_AGE, PREDATOR_SPEED, REPRODUCITON_THRESHOLD } from "../constants";
import { findClosestPrey, randomFieldViewAngle } from "../helpers";
import type { IPredator, IPrey } from "../interface";
import Agent from "./agent";

/**
 * Entity: Predator
 */
export default class Predator extends Agent implements IPredator {
    isEating: boolean;
    count: number;
    digestion: number;

    constructor(x: number, y: number) {
        super(x, y);
        this.skinColor = "#FF1414";
        this.hairColor = "#9c0000";
        this.velocity = PREDATOR_SPEED;
        this.digestion = 0;
        this.isEating = false;
        this.count = 0;
        this.energy = MAX_ENERGY_LEVEL;
    }

    public update(dt: number): void {
        super.update(dt);
        if (this.age > PREDATOR_MAX_AGE) {
            this.opacity = Math.min(1, PREDATOR_MAX_AGE / (4 * this.age));
            return;
        }
        this.updateTarget();
        if (this.isEating) {
            if (Math.floor(this.digestion) >= DIGESTION_TIME) {
                this.isEating = false;
                this.digestion = 0;
            } else {
                this.digestion += dt;
            }
            this.size = 1.1 * MAX_SIZE;
            this.height = 1.1 * MAX_HEIGHT;
        } else {
            if (this.energy > MIN_ENERGY_LEVEL) {
                this.updateBody(dt);
                this.move(dt);
                this.energy = Math.max(this.energy - ENERGY_LOSS_RATE, MIN_ENERGY_LEVEL);
            }
        }
    }

    /**
     * Eat prey in the attack perimeter
     */
    public hunt(prey: IPrey[]): void {
        const closestPrey = findClosestPrey(this, prey);
        if (closestPrey) {
            const { x: x1, y: y1 } = this;
            const { x: x2, y: y2 } = closestPrey;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < ATTACK_PERIMETER_FACTOR * this.height) this.setTarget(x2, y2);
            if (distance < this.size) {
                prey.splice(prey.indexOf(closestPrey), 1);
                this.target = undefined;
                this.isEating = true;
                this.count++;
                this.energy = Math.min(this.energy + closestPrey.energy, MAX_ENERGY_LEVEL);
            }
        }
    }

    private hasReproduced = false;

    /**
     * Give birth to kids in favorable conditions
     */
    public reproduce<IPredator>(predators: IPredator[]): void {
        if (this.hasReproduced) return;
        if (Math.random() > Math.random() && this.count && this.energy >= REPRODUCITON_THRESHOLD && this.age >= PREDATOR_MATURITY_AGE_FACTOR * PREDATOR_MAX_AGE) {
            // produce descendants -> random number
            const num = Math.max(1, Math.floor(Math.random() * MAX_CHILDREN));
            // make babies :)
            const descendants: IPredator[] = new Array(num).fill(null).map((_) => {
                const child = new Predator(this.x, this.y);
                child.energy = REPRODUCITON_THRESHOLD;
                child.angle = randomFieldViewAngle(this.angle);
                child.setTarget();
                return child as IPredator;
            });
            // add them to the world
            predators.push(...descendants);
            // no more babies :)
            this.hasReproduced = true;
        }
    }
}
import type { IPredator, IPrey, Point } from "../interface";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";

/**
 * Get a random location within the field
 */
export function randomLocation(): Point {
    return {
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
    };
}

/**
 * The world is round...
 *  => teleport the agent in case it reaches the boundary
 */
export function wrapAroundBoundary<T extends Point>(agent: T, offset = 0): boolean {
    let reset = true;
    if (agent.x < -offset) {
        agent.x = CANVAS_WIDTH + offset;
    } else if (agent.x > CANVAS_WIDTH + offset) {
        agent.x = -offset;
    } else {
        reset = false;
    }
    if (agent.y < -offset) {
        agent.y = CANVAS_HEIGHT + offset;
    } else if (agent.y > CANVAS_HEIGHT + offset) {
        agent.y = -offset;
    } else {
        reset = false;
    }
    return reset;
}

/**
 * Predator search for the closet prey in the world
 */
export function findClosestPrey(predator: IPredator, prey: IPrey[]) {
    let closestPrey: IPrey | undefined;
    let closestDistance = Infinity;

    prey.forEach((p) => {
        const dx = p.x - predator.x;
        const dy = p.y - predator.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestPrey = p;
        }
    });

    return closestPrey;
}
import { EYE_VIEW_ANGLE } from "../constants";

/**
 * Angle limits: -180deg and 180deg
 * => convert the angle `x` into a match within the limts
 */
export function limitAngle(x: number): number {
    if (x > Math.PI) return x - (2 * Math.PI);
    if (x < -Math.PI) return (2 * Math.PI) + x;
    return x;
}

const PARTIAL_EYE_VIEW = EYE_VIEW_ANGLE / 2;

/**
 * Generate a random direction or angle depending on the current field of view
 */
export function randomFieldViewAngle(x: number, sideAngle = PARTIAL_EYE_VIEW): number {
    const [min, max] = [x - sideAngle, x + sideAngle].sort((a, b) => a == b ? 1 : a < b ? -1 : 1);
    return limitAngle(Math.random() * (max - min) + min);
}
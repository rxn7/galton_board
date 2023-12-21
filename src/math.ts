import { Vector2 } from "./vector2.js"

export namespace MathUtils {
    const DEG_TO_RAD_COEFF = Math.PI / 180.0

    export const degreesToRadians = (degrees: number): number => degrees * DEG_TO_RAD_COEFF

    export const directionFromAngle = (angleDegrees: number): Vector2 => { 
        const angleRadians = degreesToRadians(angleDegrees)

        return {
            x: Math.cos(angleRadians),
            y: Math.sin(angleRadians) 
        }
    }
}
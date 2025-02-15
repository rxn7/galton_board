import { Vector2 } from './vector2.js'

export namespace MathUtils {
	const DEG_TO_RAD_COEFF = Math.PI / 180.0

	export const degreesToRadians = (degrees: number): number => degrees * DEG_TO_RAD_COEFF

	export function directionFromAngle(angleDegrees: number): Vector2 {
		const angleRadians = degreesToRadians(angleDegrees)

		return {
			x: Math.cos(angleRadians),
			y: Math.sin(angleRadians),
		}
	}

	// Built-in implementation is too slow
	export function maxFromArray(array: Array<number>): number {
		if(array.length === 0) return NaN

		let max: number = array[0]
		for(let n of array) {
			if(n > max) max = n
		}

		return max
	}

	export function lerp(a: number, b: number, t: number): number {
		return a + (b - a) * t
	}

	export function lerpVector2(a: Vector2, b: Vector2, t: number): Vector2 {
		return {
			x: lerp(a.x, b.x, t),
			y: lerp(a.y, b.y, t),
		}
	}
}

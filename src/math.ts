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

	export function maxFromArray(array: Array<number>): number {
		if (array.length === 0) return 0

		let max: number = array[0]

		array.forEach(n => {
			if (n > max) max = n
		})

		return max
	}
}

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
    
    export function lerpColor(from: string, to: string, t: number): string {
        const r1 = parseInt(from.substring(1, 3), 16)
        const g1 = parseInt(from.substring(3, 5), 16)
        const b1 = parseInt(from.substring(5, 7), 16)

        const r2 = parseInt(to.substring(1, 3), 16)
        const g2 = parseInt(to.substring(3, 5), 16)
        const b2 = parseInt(to.substring(5, 7), 16)

        const r = Math.round(lerp(r1, r2, t))
        const g = Math.round(lerp(g1, g2, t))
        const b = Math.round(lerp(b1, b2, t))

        return `rgb(${r},${g},${b})`
    }
}

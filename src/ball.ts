import Board from './board.js'
import { MathUtils } from './math.js'
import { Vector2 } from './vector2.js'

export default class Ball {
	public static readonly moveSpeed: number = 1
	public static readonly color: string = '#0f0'

	public queueDelete: boolean = false
	public lastCollidedPinRowIdx: number = -1
	public position: Vector2 = { x: 0, y: 0 }
	public direction: Vector2 = { x: 0, y: 1 }

	public constructor(private readonly board: Board, startPosition: Vector2) {
		this.position = startPosition
	}

	public update(deltaTimeMs: number): void {
		this.position.x += this.direction.x * deltaTimeMs * Ball.moveSpeed
		this.position.y += this.direction.y * deltaTimeMs * Ball.moveSpeed

		if (this.board.isBallCollidingWithPins(this)) {
			this.direction = MathUtils.directionFromAngle(Math.random() < 0.5 ? 45 : 135)
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath()
		ctx.fillStyle = Ball.color
		ctx.arc(this.position.x, this.position.y, this.board.pinRadius, 0, 2 * Math.PI, false)
		ctx.fill()
	}
}

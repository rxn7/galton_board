import Board from './board.js'
import { Vector2 } from './vector2.js'

export default class Ball {
	public static readonly MOVE_SPEED: number = 1 / 10
	public static readonly RADIUS: number = 8
	public static readonly COLOR: string = '#00f'

	public lastCollidedPinRowIdx: number = -1
	public position: Vector2 = { x: 0, y: 0 }
	public direction: Vector2 = { x: 0, y: 1 }

	public constructor(private readonly board: Board, startPosition: Vector2) {
		this.position = startPosition
	}

	public update(deltaTimeMs: number): void {
		this.position.x += this.direction.x * deltaTimeMs * Ball.MOVE_SPEED 
		this.position.y += this.direction.y * deltaTimeMs * Ball.MOVE_SPEED

		if (this.board.isBallCollidingWithPins(this)) {
			this.direction.x = Math.random() < 0.5 ? -1 : 1
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath()
		ctx.fillStyle = Ball.COLOR
		ctx.arc(this.position.x, this.position.y, Ball.RADIUS, 0, 2 * Math.PI, false)
		ctx.fill()
	}
}

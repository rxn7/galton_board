import Board from './board.js'
import { MathUtils } from './math.js'
import { Options } from './options.js'
import { Pin } from './pin.js'
import { Vector2 } from './vector2.js'

export default class Ball {
	public static color: string = '#689d6a'

	public queueDelete: boolean = false
	public position: Vector2 = { x: 0, y: 0 }

	private timer: number = 0.0

	private lastPin?: Pin = undefined
	private nextPin: Pin = { row: 0, idx: 0 }

	public constructor(private readonly startPosition: Vector2) {
		this.position = startPosition
	}

	public update(board: Board, deltaTimeMs: number): void {
		this.timer += deltaTimeMs

		const previousPosition: Vector2 = this.lastPin ? board.getPinPosition(this.lastPin) : this.startPosition
		const nextPosition: Vector2 = board.getPinPosition(this.nextPin)

		const t: number = Math.min(this.timer / Options.ballBounceTime, 1.0)
		this.position = this.bouncePosition(board, MathUtils.lerpVector2(previousPosition, nextPosition, t), t)

		if(t >= 1.0) {
			this.timer = 0.0

			if(this.nextPin.row >= board.rowCount-1) {
				this.queueDelete = true
				board.registerHit(this.nextPin.idx)
				return
			}

			this.calculateNextPin(board)
		}
	}

	public render(board: Board, ctx: CanvasRenderingContext2D): void {
		ctx.beginPath()
		ctx.fillStyle = Ball.color
		ctx.arc(this.position.x, this.position.y, board.pinRadius, 0, 2 * Math.PI, false)
		ctx.fill()
	}

	private calculateNextPin(board: Board): void {
		this.lastPin = this.nextPin
		this.nextPin = board.getNextPin(this.lastPin)
	}

	private bouncePosition(board: Board, position: Vector2, t: number): Vector2 {
		const bounce = Math.sin(t * Math.PI)
		const bounceOffset = bounce * board.pinRadius * 3

		return {
			x: position.x,
			y: position.y - bounceOffset
		}
	}
}

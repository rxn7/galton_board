import Board from './board.js'
import { ctx } from './index.js'
import { MathUtils } from './math.js'
import { Pin } from './pin.js'
import { Vector2 } from './vector2.js'

export default class Ball {
	public static readonly moveTimeMs: number = 500
	public static readonly color: string = '#689d6a'

	public queueDelete: boolean = false
	public position: Vector2 = { x: 0, y: 0 }

	private timer: number = 0.0

	private lastPin?: Pin = undefined
	private nextPin: Pin = { row: 0, idx: 0 }

	public constructor(private readonly board: Board, private readonly startPosition: Vector2) {
		this.position = startPosition
		this.calculateNextPin()
	}

	public update(deltaTimeMs: number): void {
		this.timer += deltaTimeMs

		const previousPosition: Vector2 = this.lastPin ? this.board.getPinPosition(this.lastPin) : this.startPosition
		const nextPosition: Vector2 = this.board.getPinPosition(this.nextPin)

		const t: number = Math.min(this.timer / Ball.moveTimeMs, 1.0)
		this.position = MathUtils.lerpVector2(previousPosition, nextPosition, t)

		if(this.timer >= Ball.moveTimeMs) {
			this.timer = 0.0

			if(this.nextPin.row >= this.board.rowCount-1) {
				this.queueDelete = true
				this.board.registerHit(this.nextPin.idx)
				return
			}

			this.calculateNextPin()
		}
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath()
		ctx.fillStyle = Ball.color
		ctx.arc(this.position.x, this.position.y, this.board.pinRadius, 0, 2 * Math.PI, false)
		ctx.fill()
	}

	private calculateNextPin(): void {
		this.lastPin = this.nextPin
		this.nextPin = this.board.getNextPin(this.lastPin)
	}
}

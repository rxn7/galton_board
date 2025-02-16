import Ball from './ball'
import { ctx } from './index'
import { MathUtils } from './math'
import { Pin } from './pin.js'
import { Vector2 } from './vector2.js'
import Sound from './audio'

export default class Board {
	private static hitSound: Sound = new Sound('audio/hit.ogg', 0.1)
	public yOffset: number = 10
	public pinSpacing: number = 8
	public pinRadius: number = 8
	public rowHeight: number = this.pinSpacing * 2 + this.pinRadius * 2

	private columnsHitCount: Array<number> = []
	private graphSize: number = 100

	constructor(canvas: HTMLCanvasElement, public readonly rowCount: number = 8) {
		for(let i = 0; i < this.rowCount; ++i) {
			this.columnsHitCount.push(0)
		}

		this.onCanvasResize(canvas)
	}

	public onCanvasResize(canvas: HTMLCanvasElement): void {
		const minSize: number = Math.min(canvas.clientWidth, canvas.clientHeight)

		this.pinSpacing = minSize / (this.rowCount * 12)
		this.pinRadius = minSize / (this.rowCount * 8)
		this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2
		this.graphSize = minSize / 2.5

		const verticalSize: number = this.rowCount * this.rowHeight + this.graphSize
		this.yOffset = (canvas.clientHeight - verticalSize) * 0.5
	}

	public render(ctx: CanvasRenderingContext2D): void {
		const maxHitCount: number = MathUtils.maxFromArray(this.columnsHitCount)

		for(let row: number = 0; row < this.rowCount; ++row) {
			for(let pin: number = 0; pin < row + 1; ++pin) {
				const position: Vector2 = this.getPinPosition({row: row, idx: pin})

				const isLastRow: boolean = row === this.rowCount - 1
				let radius: number = this.pinRadius

				if(isLastRow) {
					radius *= 2
					const ratio: number = this.columnsHitCount[pin] / maxHitCount
					this.renderGraphLine(ctx, position.x, position.y, ratio)
				} else {
					radius *= 0.5
				}

				ctx.beginPath()
				ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI)
				ctx.fillStyle = '#cc241d'
				ctx.fill()

				if(isLastRow) {
					ctx.fillStyle = '#fbf1c7'
					ctx.textAlign = 'center'
					ctx.textBaseline = 'top'
					ctx.font = `bold ${radius}px monospace`
					ctx.fillText(this.columnsHitCount[pin].toString(), position.x, position.y - radius * 0.5, radius * 2)
				}
			}
		}
	}

	public registerHit(row: number): void {
		++this.columnsHitCount[row]
		Board.hitSound.play(0.5 + Math.random() * 1.0)
	}

	private renderGraphLine(ctx: CanvasRenderingContext2D, x: number, y: number, ratio: number): void {
		ctx.beginPath()
		ctx.fillStyle = '#fbf1c7'
		ctx.roundRect(x - this.pinRadius, y, this.pinRadius * 2, ratio * this.graphSize, [0, 0, this.pinRadius, this.pinRadius])
		ctx.fill()
		ctx.beginPath()
	}

	public getNextPin(lastPin: Pin): Pin {
		const nextRow: number = lastPin.row + 1
		let nextIdx: number

		if(lastPin.idx === 0) {
			nextIdx = Math.random() > 0.5 ? 0 : 1
		} else if(lastPin.idx === lastPin.row) {
			nextIdx = Math.random() > 0.5 ? nextRow - 1 : nextRow
		} else {
			nextIdx = lastPin.idx + (Math.random() > 0.5 ? 0 : 1)
		}

		return {
			row: nextRow,
			idx: nextIdx
		}
	}

	public getPinPosition(pin: Pin): Vector2 {
		const startX: number = ctx.canvas.clientWidth * 0.5 - pin.row * this.rowHeight

		return {
			x: startX + pin.idx * this.rowHeight * 2,
			y: this.pinRadius + pin.row * this.rowHeight + this.yOffset
		}
	}
}

import Ball from './ball.js'
import { MathUtils } from './math.js'

export default class Board {
	private yOffset: number = 10
	private lastRowStartX: number = 0
	public pinSpacing: number = 8
	public pinRadius: number = 8
	public rowHeight: number = this.pinSpacing * 2 + this.pinRadius * 2
	public colHitCount: Array<number> = []

	constructor(canvas: HTMLCanvasElement, public readonly rowCount: number = 8) {
		this.onCanvasResize(canvas)
		for (let i = 0; i < this.rowCount; ++i) this.colHitCount.push(0)
	}

	public onCanvasResize(canvas: HTMLCanvasElement): void {
		const minSize: number = Math.min(canvas.clientWidth, canvas.clientHeight)
		this.pinSpacing = minSize / (this.rowCount * 12)
		this.pinRadius = minSize / (this.rowCount * 8)
		this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2
		this.lastRowStartX = canvas.clientWidth * 0.5 - (this.rowCount - 1) * this.rowHeight
		this.yOffset = canvas.clientHeight / 20
	}

	public isBallCollidingWithPins(ball: Ball): boolean {
		if (ball.position.y + this.pinRadius * 2 < this.yOffset) return false

		const rowIdx: number = Math.floor((ball.position.y - this.yOffset - this.pinSpacing) / this.rowHeight)
		if (ball.lastCollidedPinRowIdx === rowIdx) return false

		const isLastRow: boolean = rowIdx === this.rowCount - 1
		if (isLastRow) {
			const colIdx: number = Math.round((ball.position.x - this.lastRowStartX) / (this.rowHeight * 2))
			++this.colHitCount[colIdx]
			ball.queueDelete = true
		}

		ball.lastCollidedPinRowIdx = rowIdx
		return true
	}

	public render(ctx: CanvasRenderingContext2D): void {
		const maxHitCount: number = MathUtils.maxFromArray(this.colHitCount)
		const remainingVerticalSpace: number = ctx.canvas.clientHeight - this.yOffset - this.rowHeight * this.rowCount

		for (let row: number = 0; row < this.rowCount; ++row) {
			const startX: number = ctx.canvas.clientWidth * 0.5 - row * this.rowHeight

			for (let pin: number = 0; pin < row + 1; ++pin) {
				const x: number = startX + pin * this.rowHeight * 2
				const y: number = this.pinRadius + row * this.rowHeight + this.yOffset

				const isLastRow: boolean = row === this.rowCount - 1
				let radius: number = this.pinRadius

				if (isLastRow) {
					radius *= 1.5
					const ratio: number = this.colHitCount[pin] / maxHitCount

					// Render graph line
					ctx.beginPath()
					ctx.fillStyle = '#1f1'
					ctx.roundRect(x - this.pinRadius, y, this.pinRadius * 2, ratio * remainingVerticalSpace, [0, 0, this.pinRadius, this.pinRadius])
					ctx.fill()
					ctx.beginPath()

					// Render hit count text
					ctx.fillStyle = '#000'
					ctx.textAlign = 'center'
					ctx.textBaseline = 'top'
					ctx.font = `bold ${radius}px monospace`
					ctx.fillText(this.colHitCount[pin].toString(), x, y + radius, radius * 2)
				}

				ctx.beginPath()
				ctx.arc(x, y, radius, 0, 2 * Math.PI)
				ctx.fillStyle = '#e44'
				ctx.fill()
			}
		}
	}
}

import Ball from './ball.js'

export default class Board {
	public static readonly yOffset: number = 50
	public pinSpacing: number = 8
	public pinRadius: number = 8
	public rowHeight: number = this.pinSpacing * 2 + this.pinRadius * 2

    constructor(canvas: HTMLCanvasElement, public readonly rows: number = 8) {
        this.onCanvasResize(canvas)
    }

    public onCanvasResize(canvas: HTMLCanvasElement): void {
        const minSize: number = Math.min(canvas.clientWidth, canvas.clientHeight)
        this.pinSpacing = minSize / (this.rows * 4)
        this.pinRadius = minSize / (this.rows * 2)
        this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2
    }

	public isBallCollidingWithPins(ball: Ball): boolean {
		if(ball.position.y + this.pinRadius * 2 < Board.yOffset) return false

		const rowIdx: number = Math.floor((ball.position.y - Board.yOffset - this.pinSpacing) / this.rowHeight)
		if (ball.lastCollidedPinRowIdx === rowIdx) return false
        
        if(rowIdx === this.rows - 1)
            ball.queueDelete = true

		ball.lastCollidedPinRowIdx = rowIdx
		return true
	}

	public render(ctx: CanvasRenderingContext2D): void {
		for (let row: number = 0; row < this.rows; ++row) {
			const startX: number = ctx.canvas.clientWidth * 0.5 - row * this.rowHeight

			for (let pin: number = 0; pin < row + 1; ++pin) {
				const x: number = startX + pin * this.rowHeight * 2
				const y: number = this.pinRadius + row * this.rowHeight + Board.yOffset

				ctx.beginPath()
				ctx.arc(x, y, this.pinRadius, 0, 2 * Math.PI)
				ctx.fillStyle = '#f00'
				ctx.fill()
			}
		}
	}
}

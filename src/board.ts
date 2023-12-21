import Ball from './ball.js'

export default class Board {
	public static readonly yOffset: number = 50
	public static readonly rows: number = 8
	public static readonly pinSpacing: number = 8
	public static readonly pinRadius: number = 8
	public static readonly rowHeight: number = this.pinSpacing * 2 + this.pinRadius * 2

	public isBallCollidingWithPins(ball: Ball) {
		if(ball.position.y + Ball.RADIUS + Board.pinRadius < Board.yOffset) return

		const rowIdx: number = Math.floor(ball.position.y / Board.rowHeight)
		if (ball.lastCollidedPinRowIdx === rowIdx) return false

		const distance: number = Math.abs(ball.position.y - rowIdx * Board.rowHeight)
		if (distance > Ball.RADIUS) return false

		ball.lastCollidedPinRowIdx = rowIdx

		return true
	}

	public render(ctx: CanvasRenderingContext2D) {
		for (let row: number = 0; row < Board.rows; ++row) {
			const startX: number = ctx.canvas.clientWidth * 0.5 - row * Board.rowHeight

			for (let pin: number = 0; pin < row + 1; ++pin) {
				const x: number = startX + pin * Board.rowHeight * 2
				const y: number = Board.pinRadius + row * Board.rowHeight + Board.yOffset

				ctx.beginPath()
				ctx.arc(x, y, Board.pinRadius, 0, 2 * Math.PI)
				ctx.fillStyle = '#f00'
				ctx.fill()
			}
		}
	}
}

import Ball from './ball.js'
import Board from './board.js'

const ctx: CanvasRenderingContext2D = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D
const board: Board = new Board()
const balls: Array<Ball> = [new Ball(board, { x: ctx.canvas.width * 0.5, y: 0 })]
let lastFrameTime: DOMHighResTimeStamp = 0

function gameLoop(time: DOMHighResTimeStamp): void {
	const deltaTimeMs: number = time - lastFrameTime
	lastFrameTime = time

	ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)

	board.render(ctx)

	balls.forEach(ball => {
		ball.update(deltaTimeMs)
		ball.render(ctx)
	})

	requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)

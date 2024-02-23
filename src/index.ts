import Ball from './ball.js'
import Board from './board.js'

const ballSpawnInterval: number = 200
const minimunFps: number = 60
const minimumDeltaTime: number = 1 / minimunFps

const ctx: CanvasRenderingContext2D = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d', { alpha: false, willReadFrequently: false }) as CanvasRenderingContext2D
const board: Board = new Board(ctx.canvas, 19)
const balls: Array<Ball> = []
let lastFrameTime: DOMHighResTimeStamp = 0

function init() {
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'
	spawnBall()

	const resizeCanvas = (): void => {
		balls.length = 0
		ctx.canvas.width = window.innerWidth
		ctx.canvas.height = window.innerHeight
		board.onCanvasResize(ctx.canvas)
	}

	resizeCanvas()
	window.addEventListener('resize', () => resizeCanvas())

	requestAnimationFrame(gameLoop)
}

function gameLoop(time: DOMHighResTimeStamp): void {
	const deltaTimeMs: number = Math.max(time - lastFrameTime, minimumDeltaTime)
	lastFrameTime = time

	ctx.fillStyle = '#282828'
	ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)

	board.render(ctx)

	balls.forEach((ball, idx, object) => {
		ball.update(deltaTimeMs)

		if (ball.queueDelete) {
			object.splice(idx, 1)
			return
		}

		ball.render(ctx)
	})

	requestAnimationFrame(gameLoop)
}

function spawnBall() {
	balls.push(new Ball(board, { x: ctx.canvas.clientWidth * 0.5, y: -board.pinRadius }))
	setTimeout(spawnBall, ballSpawnInterval)
}

init()

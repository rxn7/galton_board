import Ball from './ball'
import Board from './board'
import { Options } from './options'

const minimunFps: number = 60
const minimumDeltaTime: number = 1 / minimunFps
const maximumDeltaTime: number = 100

export const ctx: CanvasRenderingContext2D = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d', { alpha: false, willReadFrequently: false }) as CanvasRenderingContext2D
export let board: Board = new Board(ctx.canvas, 19)
const balls: Array<Ball> = []
let lastFrameTime: DOMHighResTimeStamp = 0

function init() {
	ctx.imageSmoothingEnabled = true
	ctx.imageSmoothingQuality = 'high'

	const resizeCanvas = (): void => {
		ctx.canvas.width = window.innerWidth
		ctx.canvas.height = window.innerHeight
		board.onCanvasResize(ctx.canvas)
	}

	Options.init()

	resizeCanvas()
	window.addEventListener('resize', () => resizeCanvas())

	requestAnimationFrame(gameLoop)
	spawnBall()
}

function gameLoop(time: DOMHighResTimeStamp): void {
	requestAnimationFrame(gameLoop)

	if(document.hidden) {
		return
	}

	const deltaTimeMs: number = Math.min(maximumDeltaTime, Math.max(time - lastFrameTime, minimumDeltaTime))
	lastFrameTime = time

	ctx.fillStyle = '#282828'
	ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)

	board.render(ctx)

	balls.forEach((ball, idx, object) => {
		ball.update(board, deltaTimeMs)

		if(ball.queueDelete) {
			object.splice(idx, 1)
			return
		}

		ball.render(board, ctx)
	})
}

function spawnBall() {
	balls.push(new Ball({ x: ctx.canvas.clientWidth * 0.5, y: -board.pinRadius }))

	setTimeout(spawnBall, Options.ballSpawnInterval + Math.random() * Options.ballSpawnInterval * 0.1)
}

export function recreateBoard(rowCount: number): void {
	balls.length = 0
	board = new Board(ctx.canvas, rowCount)
}

init()

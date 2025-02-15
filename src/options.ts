import Ball from "./ball.js"
import { recreateBoard } from "./index.js"

export namespace Options {
	const rowCountInput: HTMLInputElement = document.getElementById('row-count-input') as HTMLInputElement
	rowCountInput.addEventListener('input', (evt: Event) => {
		const value: number = parseInt((evt.target as HTMLInputElement).value)
		recreateBoard(value)
	})

	export let ballBounceTime: number = 500
	const ballBounceTimeInput: HTMLInputElement = document.getElementById('ball-bounce-time-input') as HTMLInputElement
	ballBounceTimeInput.value = ballBounceTime.toString()
	ballBounceTimeInput.addEventListener('input', (evt: Event) => {
		const value: number = parseInt((evt.target as HTMLInputElement).value)
		ballBounceTime = value
	})

	export let ballSpawnInterval: number = 500
	const ballSpawnIntervalInput: HTMLInputElement = document.getElementById('ball-spawn-interval-input') as HTMLInputElement
	ballSpawnIntervalInput.value = ballSpawnInterval.toString()
	ballSpawnIntervalInput.addEventListener('input', (evt: Event) => {
		const value: number = parseInt((evt.target as HTMLInputElement).value)
		ballSpawnInterval = value
	})
}

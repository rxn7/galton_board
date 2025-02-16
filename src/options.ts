import { board, recreateBoard } from "./index"

export namespace Options {
	const rowCountInput: HTMLInputElement = document.getElementById('row-count-input') as HTMLInputElement
	rowCountInput.addEventListener('input', (evt: Event) => {
		const value: number = parseInt((evt.target as HTMLInputElement).value)
		recreateBoard(value)
	})

	export let ballBounceTime: number = 200
	const ballBounceTimeInput: HTMLInputElement = document.getElementById('ball-bounce-time-input') as HTMLInputElement
	ballBounceTimeInput.addEventListener('input', (evt: Event) => {
		const value: number = parseInt((evt.target as HTMLInputElement).value)
		ballBounceTime = value
	})

	export let ballSpawnInterval: number = 150
	const ballSpawnIntervalInput: HTMLInputElement = document.getElementById('ball-spawn-interval-input') as HTMLInputElement
	ballSpawnIntervalInput.addEventListener('input', (evt: Event) => {
		const value: number = parseInt((evt.target as HTMLInputElement).value)
		ballSpawnInterval = value
	})

	export let simulateButton: HTMLButtonElement = document.getElementById('simulate-button') as HTMLButtonElement
	simulateButton.addEventListener('click', () => {
		const input: string | null= prompt("How many balls do you want to simulate?", "100000")
		const ballCount: number = parseInt(input || "")

		if(!isNaN(ballCount) && ballCount > 0) {
			board.simulate(ballCount)
		}
	})

	export function init() {
		ballSpawnIntervalInput.value = ballSpawnInterval.toString()
		ballBounceTimeInput.value = ballBounceTime.toString()
		rowCountInput.value = board.rowCount.toString()
	}
}

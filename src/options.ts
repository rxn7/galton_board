import { recreateBoard } from "./index.js"

const optionsContainer: HTMLDivElement = document.getElementById('options-container') as HTMLDivElement
const rowCountInput: HTMLInputElement = document.getElementById('row-count-input') as HTMLInputElement

rowCountInput.addEventListener('input', (evt: Event) => {
	const value: number = parseInt((evt.target as HTMLInputElement).value)
	recreateBoard(value)
})

import { ctx } from './index'
import { MathUtils } from './math'
import { PinPosition } from './pin.js'
import { Vector2 } from './vector2.js'
import Sound from './audio'

import hitAudioResource from './assets/audio/hit.ogg'
const hitSound: Sound = new Sound(hitAudioResource, 0.1)

// Pin in the last row
type HitPin = {
    hitCount: number
}

type Pin = {
	lastTimeHit: number
}

type PinRenderData = {
    position: Vector2
    color: string
    radius: number
}

export default class Board {
    private static readonly hitPinAnimationDuration: number = 200
    private static readonly normalPinAnimationDuration: number = 100

	public yOffset: number = 10
	public pinSpacing: number = 8
	public pinRadius: number = 8
	public rowHeight: number = this.pinSpacing * 2 + this.pinRadius * 2

    private hitPins: HitPin[] = []
	private pins: Pin[][] = new Array(this.rowCount)
	private graphSize: number = 0

	constructor(canvas: HTMLCanvasElement, public readonly rowCount: number = 8) {
        this.hitPins = new Array<HitPin>(this.rowCount)

        for(let i: number = 0; i < this.rowCount; ++i) {
            this.hitPins[i] = { hitCount: 0 }

			this.pins[i] = new Array<Pin>(i + 1)
			for(let j: number = 0; j < i + 1; ++j) {
				this.pins[i][j] = { lastTimeHit: -1 }
			}
        }

		console.log(this.pins)

		this.onCanvasResize(canvas)
	}

	public onCanvasResize(canvas: HTMLCanvasElement): void {
		const minSize: number = Math.min(canvas.clientWidth, canvas.clientHeight)

		// TODO: Automagically calculate perfect ratios for everything

		this.pinSpacing = minSize / (this.rowCount * 10)
		this.pinRadius = minSize / (this.rowCount * 7)
		this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2
		this.graphSize = minSize / 4

		const verticalSize: number = this.rowCount * this.rowHeight + this.graphSize
		this.yOffset = (canvas.clientHeight - verticalSize) * 0.5
	}

	public render(ctx: CanvasRenderingContext2D): void {
		let maxHitCount: number = 0
        this.hitPins.forEach((hitPin: HitPin) => {
            if(hitPin.hitCount > maxHitCount) {
                maxHitCount = hitPin.hitCount
			}
        })

		this.renderDistribution(ctx)

		for(let row: number = 0; row < this.rowCount; ++row) {
			for(let idx: number = 0; idx < row + 1; ++idx) {
				const pinPosition: PinPosition = { row: row, idx: idx }

                const data: PinRenderData = {
                    position: this.getPinWorldPosition(pinPosition),
                    radius: this.pinRadius,
                    color: '#cc241d'
                }

				const isHitPin: boolean = this.isHitPin(pinPosition)
				if(isHitPin) {
					data.radius *= 2.0
					const ratio: number = this.hitPins[idx].hitCount / maxHitCount
					this.renderGraphLine(ctx, data.position.x, data.position.y, ratio)
				} 

				this.handlePinAnimation(pinPosition, data)
                this.renderPin(data)

                if(isHitPin) {
                    this.renderHitPinText(idx, data)
                }
			}
		}
	}

	public onPinHit(position: PinPosition, playSound: boolean = true): void {
		this.pins[position.row][position.idx].lastTimeHit = performance.now()

		if(position.row === this.rowCount - 1) {
			const hitPin: HitPin = this.hitPins[position.idx]
			++hitPin.hitCount
		}

		if(this.isHitPin(position) && playSound) {
			hitSound.play(0.5 + Math.random() * 1.0)
		}
	}

	public getNextPin(lastPin: PinPosition): PinPosition {
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

	public getPinWorldPosition(pinPosition: PinPosition): Vector2 {
		const startX: number = ctx.canvas.clientWidth * 0.5 - pinPosition.row * this.rowHeight

		return {
			x: startX + pinPosition.idx * this.rowHeight * 2,
			y: this.getRowY(pinPosition.row)
		}
	}

	public getRowY(row: number): number {
		return this.pinRadius + row * this.rowHeight + this.yOffset
	}

	public isHitPin(pinPosition: PinPosition): boolean {
		return pinPosition.row === this.rowCount - 1
	}

	public simulate(ballCount: number): void {
		for(let i: number = 0; i < ballCount; ++i) {
			let pinPosition: PinPosition = { row: 0, idx: 0 }

			while(pinPosition.row < this.rowCount - 1) {
				pinPosition = this.getNextPin(pinPosition)
			}

			this.onPinHit({row: pinPosition.row, idx: pinPosition.idx}, false)
		}

		hitSound.play(0.5 + Math.random() * 1.0)
	}

    private renderPin(data: PinRenderData): void {
		ctx.beginPath()
        ctx.arc(data.position.x, data.position.y, data.radius, 0, 2 * Math.PI)
        ctx.fillStyle = data.color
        ctx.fill()
    }

    private renderHitPinText(pin: number, data: PinRenderData): void {
        ctx.fillStyle = '#fbf1c7'
        ctx.textAlign = 'center' 
        ctx.textBaseline = 'top'
        ctx.font = `bold ${data.radius}px monospace`
        ctx.fillText(this.hitPins[pin].hitCount.toString(), data.position.x, data.position.y - data.radius * 0.5, data.radius * 2)
    }

	private renderGraphLine(ctx: CanvasRenderingContext2D, x: number, y: number, ratio: number): void {
		ctx.beginPath()
		ctx.fillStyle = '#fbf1c7'
		ctx.roundRect(x - this.pinRadius, y, this.pinRadius * 2, ratio * this.graphSize, [0, 0, this.pinRadius, this.pinRadius])
		ctx.fill()
		ctx.beginPath()
	}
	
	private renderDistribution(ctx: CanvasRenderingContext2D): void {
		const leftPin: PinPosition = { row: this.rowCount - 1, idx: 0 }
		const rightPin: PinPosition = { row: this.rowCount - 1, idx: this.rowCount - 1 }
		const lineWidth: number = 4
		const startX: number = this.getPinWorldPosition(leftPin).x - this.pinRadius * 2
		const startY: number = this.getRowY(this.rowCount - 1) + lineWidth * 0.5
		const endX: number = this.getPinWorldPosition(rightPin).x + this.pinRadius * 2
		const graphWidth: number = endX - startX
		const maxProbability: number = MathUtils.binomialDistribution(this.rowCount - 1, Math.floor(this.rowCount / 2), 0.5)
		
		ctx.beginPath()
		ctx.moveTo(startX, startY)

		const segments: number = 100
		const step: number = graphWidth / segments
		for(let i: number = 1; i <= segments; ++i) {
			const x: number = startX + i * step
			const k: number = ((x - startX) / graphWidth) * (this.rowCount - 1)

			const binomialProbability: number = MathUtils.binomialDistribution(this.rowCount - 1, k, 0.5)
			const normalizedProbability: number = binomialProbability / maxProbability

            const y: number = startY + normalizedProbability * (this.graphSize  + lineWidth * 0.5)
			ctx.lineTo(x, y)
        }

        ctx.strokeStyle = '#458588'
        ctx.lineWidth = 2
        ctx.stroke()
	}

    private handlePinAnimation(pinPosition: PinPosition, data: PinRenderData): void {
        const pin: Pin = this.pins[pinPosition.row][pinPosition.idx]

        if(pin.lastTimeHit > -1) {
            const age: number = performance.now() - pin.lastTimeHit
            if(age < Board.hitPinAnimationDuration) {
				if(this.isHitPin(pinPosition)) {
					const t: number = age / Board.hitPinAnimationDuration
					data.position.y += Math.sin(t * Math.PI) * data.radius
					data.radius += Math.sin(t * Math.PI) * data.radius * 0.2
					data.color = MathUtils.lerpColor(data.color, '#00ff00', t)
				} else {
					const t: number = age / Board.normalPinAnimationDuration
					data.position.y += Math.sin(t * Math.PI) * data.radius * 0.5
				}
            }
        }
    }
}

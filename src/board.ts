import { ctx } from './index'
import { MathUtils } from './math'
import { Pin } from './pin.js'
import { Vector2 } from './vector2.js'
import Sound from './audio'

import hitAudioResource from './assets/audio/hit.ogg'
const hitSound: Sound = new Sound(hitAudioResource, 0.1)

// Pin in the last row
type HitPin = {
    hitCount: number
    lastTimeHit: number
}

type PinRenderData = {
    position: Vector2
    color: string
    radius: number
}

export default class Board {
    private static readonly hitPinAnimationDuration: number = 100

	public yOffset: number = 10
	public pinSpacing: number = 8
	public pinRadius: number = 8
	public rowHeight: number = this.pinSpacing * 2 + this.pinRadius * 2

    private hitPins: Array<HitPin> = []
	private graphSize: number = 0

	constructor(canvas: HTMLCanvasElement, public readonly rowCount: number = 8) {
        this.hitPins = new Array<HitPin>(this.rowCount)
        for(let i: number = 0; i < this.rowCount; ++i) {
            this.hitPins[i] = { hitCount: 0, lastTimeHit: -1 }
        }

		this.onCanvasResize(canvas)
	}

	public onCanvasResize(canvas: HTMLCanvasElement): void {
		const minSize: number = Math.min(canvas.clientWidth, canvas.clientHeight)

		this.pinSpacing = minSize / (this.rowCount * 10)
		this.pinRadius = minSize / (this.rowCount * 5)
		this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2
		this.graphSize = minSize / 4

		const verticalSize: number = this.rowCount * this.rowHeight + this.graphSize
		this.yOffset = (canvas.clientHeight - verticalSize) * 0.5
	}

	public render(ctx: CanvasRenderingContext2D): void {
		let maxHitCount: number = 0
        this.hitPins.forEach((hitPin: HitPin) => {
            if(hitPin.hitCount > maxHitCount)
                maxHitCount = hitPin.hitCount
        })

		for(let row: number = 0; row < this.rowCount; ++row) {
			for(let pin: number = 0; pin < row + 1; ++pin) {
                const data: PinRenderData = {
                    position: this.getPinPosition({row: row, idx: pin}),
                    radius: this.pinRadius,
                    color: '#cc241d'
                }

				const isHitPin: boolean = row === this.rowCount - 1
				if(isHitPin) {
					data.radius *= 2.0
					const ratio: number = this.hitPins[pin].hitCount / maxHitCount
					this.renderGraphLine(ctx, data.position.x, data.position.y, ratio)
                    this.handleHitPinAnimation(pin, data)
				} 

                this.renderPin(data)
                if(isHitPin) {
                    this.renderHitPinText(pin, data)
                }
			}
		}
	}

	public registerHit(idx: number, playSound: boolean = true): void {
        const hitPin: HitPin = this.hitPins[idx]
		++hitPin.hitCount
        hitPin.lastTimeHit = performance.now()

		if(playSound) {
			hitSound.play(0.5 + Math.random() * 1.0)
		}
	}

	public getNextPin(lastPin: Pin): Pin {
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

	public getPinPosition(pin: Pin): Vector2 {
		const startX: number = ctx.canvas.clientWidth * 0.5 - pin.row * this.rowHeight

		return {
			x: startX + pin.idx * this.rowHeight * 2,
			y: this.pinRadius + pin.row * this.rowHeight + this.yOffset
		}
	}

	public simulate(ballCount: number): void {
		for(let i: number = 0; i < ballCount; ++i) {
			let pin: Pin = { row: 0, idx: 0 }

			while(pin.row < this.rowCount - 1) {
				pin = this.getNextPin(pin)
			}

			this.registerHit(pin.idx, false)
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

    private handleHitPinAnimation(pin: number, data: PinRenderData): void {
        const hitPin: HitPin = this.hitPins[pin]
        if(hitPin.lastTimeHit > -1) {
            const age: number = performance.now() - hitPin.lastTimeHit
            if(age < Board.hitPinAnimationDuration) {
                const t: number = age / Board.hitPinAnimationDuration
                data.position.y += Math.sin(t * Math.PI) * data.radius
                data.radius += Math.sin(t * Math.PI) * data.radius * 0.2
                data.color = MathUtils.lerpColor(data.color, '#00ff00', t)
            }
        }
    }
}

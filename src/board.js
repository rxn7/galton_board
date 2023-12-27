import Ball from './ball.js';
import { MathUtils } from './math.js';
export default class Board {
    constructor(canvas, rowCount = 8) {
        this.rowCount = rowCount;
        this.yOffset = 10;
        this.lastRowStartX = 0;
        this.pinSpacing = 8;
        this.pinRadius = 8;
        this.graphSize = 100;
        this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2;
        this.colHitCount = [];
        this.onCanvasResize(canvas);
        for (let i = 0; i < this.rowCount; ++i)
            this.colHitCount.push(0);
    }
    onCanvasResize(canvas) {
        const minSize = Math.min(canvas.clientWidth, canvas.clientHeight);
        this.pinSpacing = minSize / (this.rowCount * 12);
        this.pinRadius = minSize / (this.rowCount * 8);
        this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2;
        this.lastRowStartX = canvas.clientWidth * 0.5 - (this.rowCount - 1) * this.rowHeight;
        this.graphSize = minSize / 10;
        const verticalSize = this.rowCount * this.rowHeight + this.graphSize;
        this.yOffset = (canvas.clientHeight - verticalSize) * 0.5;
    }
    isBallCollidingWithPins(ball) {
        if (ball.position.y + this.pinRadius * 2 < this.yOffset)
            return false;
        const rowIdx = Math.floor((ball.position.y - this.yOffset - this.pinSpacing) / this.rowHeight);
        if (ball.lastCollidedPinRowIdx === rowIdx)
            return false;
        const isLastRow = rowIdx === this.rowCount - 1;
        if (isLastRow) {
            const colIdx = Math.round((ball.position.x - this.lastRowStartX) / (this.rowHeight * 2));
            ++this.colHitCount[colIdx];
            ball.queueDelete = true;
        }
        ball.lastCollidedPinRowIdx = rowIdx;
        return true;
    }
    render(ctx) {
        const maxHitCount = MathUtils.maxFromArray(this.colHitCount);
        for (let row = 0; row < this.rowCount; ++row) {
            const startX = ctx.canvas.clientWidth * 0.5 - row * this.rowHeight;
            for (let pin = 0; pin < row + 1; ++pin) {
                const x = startX + pin * this.rowHeight * 2;
                const y = this.pinRadius + row * this.rowHeight + this.yOffset;
                const isLastRow = row === this.rowCount - 1;
                let radius = this.pinRadius;
                if (isLastRow) {
                    radius *= 2;
                    const ratio = this.colHitCount[pin] / maxHitCount;
                    ctx.beginPath();
                    ctx.fillStyle = Ball.color;
                    ctx.roundRect(x - this.pinRadius, y, this.pinRadius * 2, ratio * this.graphSize, [0, 0, this.pinRadius, this.pinRadius]);
                    ctx.fill();
                    ctx.beginPath();
                }
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = '#cc241d';
                ctx.fill();
                if (isLastRow) {
                    ctx.fillStyle = '#fbf1c7';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.font = `bold ${radius}px monospace`;
                    ctx.fillText(this.colHitCount[pin].toString(), x, y - radius * 0.5, radius * 2);
                }
            }
        }
    }
}

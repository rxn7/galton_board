import Ball from './ball.js';
import { ctx } from './index.js';
import { MathUtils } from './math.js';
export default class Board {
    constructor(canvas, rowCount = 8) {
        this.rowCount = rowCount;
        this.yOffset = 10;
        this.pinSpacing = 8;
        this.pinRadius = 8;
        this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2;
        this.columnsHitCount = [];
        this.graphSize = 100;
        for (let i = 0; i < this.rowCount; ++i) {
            this.columnsHitCount.push(0);
        }
        this.onCanvasResize(canvas);
    }
    onCanvasResize(canvas) {
        const minSize = Math.min(canvas.clientWidth, canvas.clientHeight);
        this.pinSpacing = minSize / (this.rowCount * 12);
        this.pinRadius = minSize / (this.rowCount * 8);
        this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2;
        this.graphSize = minSize / 10;
        const verticalSize = this.rowCount * this.rowHeight + this.graphSize;
        this.yOffset = (canvas.clientHeight - verticalSize) * 0.5;
    }
    render(ctx) {
        const maxHitCount = MathUtils.maxFromArray(this.columnsHitCount);
        for (let row = 0; row < this.rowCount; ++row) {
            for (let pin = 0; pin < row + 1; ++pin) {
                const position = this.getPinPosition({ row: row, idx: pin });
                const isLastRow = row === this.rowCount - 1;
                let radius = this.pinRadius;
                if (isLastRow) {
                    radius *= 2;
                    const ratio = this.columnsHitCount[pin] / maxHitCount;
                    this.renderGraphLine(ctx, position.x, position.y, ratio);
                }
                else {
                    radius *= 0.5;
                }
                ctx.beginPath();
                ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = '#cc241d';
                ctx.fill();
                if (isLastRow) {
                    ctx.fillStyle = '#fbf1c7';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.font = `bold ${radius}px monospace`;
                    ctx.fillText(this.columnsHitCount[pin].toString(), position.x, position.y - radius * 0.5, radius * 2);
                }
            }
        }
    }
    registerHit(row) {
        ++this.columnsHitCount[row];
    }
    renderGraphLine(ctx, x, y, ratio) {
        ctx.beginPath();
        ctx.fillStyle = Ball.color;
        ctx.roundRect(x - this.pinRadius, y, this.pinRadius * 2, ratio * this.graphSize, [0, 0, this.pinRadius, this.pinRadius]);
        ctx.fill();
        ctx.beginPath();
    }
    getNextPin(lastPin) {
        const nextRow = lastPin.row + 1;
        let nextIdx;
        if (lastPin.idx === 0) {
            nextIdx = Math.random() > 0.5 ? 0 : 1;
        }
        else if (lastPin.idx === lastPin.row) {
            nextIdx = Math.random() > 0.5 ? nextRow - 1 : nextRow;
        }
        else {
            nextIdx = lastPin.idx + (Math.random() > 0.5 ? 0 : 1);
        }
        return {
            row: nextRow,
            idx: nextIdx
        };
    }
    getPinPosition(pin) {
        const startX = ctx.canvas.clientWidth * 0.5 - pin.row * this.rowHeight;
        return {
            x: startX + pin.idx * this.rowHeight * 2,
            y: this.pinRadius + pin.row * this.rowHeight + this.yOffset
        };
    }
}

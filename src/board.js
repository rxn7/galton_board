class Board {
    constructor(canvas, rows = 8) {
        this.rows = rows;
        this.pinSpacing = 8;
        this.pinRadius = 8;
        this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2;
        this.onCanvasResize(canvas);
    }
    onCanvasResize(canvas) {
        const minSize = Math.min(canvas.clientWidth, canvas.clientHeight);
        this.pinSpacing = minSize / (this.rows * 4);
        this.pinRadius = minSize / (this.rows * 2);
        this.rowHeight = this.pinSpacing * 2 + this.pinRadius * 2;
    }
    isBallCollidingWithPins(ball) {
        if (ball.position.y + this.pinRadius * 2 < Board.yOffset)
            return false;
        const rowIdx = Math.floor((ball.position.y - Board.yOffset - this.pinSpacing) / this.rowHeight);
        if (ball.lastCollidedPinRowIdx === rowIdx)
            return false;
        if (rowIdx === this.rows - 1)
            ball.queueDelete = true;
        ball.lastCollidedPinRowIdx = rowIdx;
        return true;
    }
    render(ctx) {
        for (let row = 0; row < this.rows; ++row) {
            const startX = ctx.canvas.clientWidth * 0.5 - row * this.rowHeight;
            for (let pin = 0; pin < row + 1; ++pin) {
                const x = startX + pin * this.rowHeight * 2;
                const y = this.pinRadius + row * this.rowHeight + Board.yOffset;
                ctx.beginPath();
                ctx.arc(x, y, this.pinRadius, 0, 2 * Math.PI);
                ctx.fillStyle = '#f00';
                ctx.fill();
            }
        }
    }
}
Board.yOffset = 50;
export default Board;

var _a;
import Ball from './ball.js';
class Board {
    isBallCollidingWithPins(ball) {
        if (ball.position.y + Ball.RADIUS + _a.pinRadius < _a.yOffset)
            return;
        const rowIdx = Math.floor(ball.position.y / _a.rowHeight);
        if (ball.lastCollidedPinRowIdx === rowIdx)
            return false;
        const distance = Math.abs(ball.position.y - rowIdx * _a.rowHeight);
        if (distance > Ball.RADIUS)
            return false;
        ball.lastCollidedPinRowIdx = rowIdx;
        return true;
    }
    render(ctx) {
        for (let row = 0; row < _a.rows; ++row) {
            const startX = ctx.canvas.width * 0.5 - (row + 1) * _a.rowHeight;
            for (let pin = 0; pin < row + 1; ++pin) {
                const x = startX + pin * _a.rowHeight * 2;
                const y = _a.pinRadius + row * _a.rowHeight + _a.yOffset;
                ctx.beginPath();
                ctx.arc(x, y, _a.pinRadius, 0, 2 * Math.PI);
                ctx.fillStyle = '#f00';
                ctx.fill();
            }
        }
    }
}
_a = Board;
Board.yOffset = 50;
Board.rows = 8;
Board.pinSpacing = 8;
Board.pinRadius = 8;
Board.rowHeight = _a.pinSpacing * 2 + _a.pinRadius * 2;
export default Board;

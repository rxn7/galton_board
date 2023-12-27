var _a;
import Ball from './ball.js';
class Board {
    isBallCollidingWithPins(ball) {
        const rowIdx = Math.floor((ball.position.y / _a.rowHeight) * _a.rows);
        if (ball.lastCollidedPinRowIdx == rowIdx)
            return false;
        const distance = Math.abs(ball.position.y - rowIdx * _a.rowHeight);
        if (distance > _a.pinRadius + Ball.RADIUS)
            return false;
        ball.lastCollidedPinRowIdx = rowIdx;
        return true;
    }
    render(ctx) {
        for (let row = 0; row < _a.rows; ++row) {
            const startX = ctx.canvas.width - (row + 1) * _a.rowHeight;
            for (let pin = 0; pin < row + 1; ++pin) {
                const x = startX + pin * _a.rowHeight;
                const y = row * _a.rowHeight;
                console.log(x);
                ctx.beginPath();
                ctx.arc(x, y, _a.pinRadius, 0, 2 * Math.PI);
                ctx.fillStyle = '#f00';
                ctx.fill();
            }
        }
    }
}
_a = Board;
Board.rows = 8;
Board.pinSpacing = 10;
Board.pinRadius = 8;
Board.rowHeight = _a.pinSpacing * 2 + _a.pinRadius * 2;
export default Board;

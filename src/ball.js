import { MathUtils } from './math.js';
class Ball {
    constructor(board, startPosition) {
        this.board = board;
        this.queueDelete = false;
        this.lastCollidedPinRowIdx = -1;
        this.position = { x: 0, y: 0 };
        this.direction = { x: 0, y: 1 };
        this.position = startPosition;
    }
    update(deltaTimeMs) {
        this.position.x += this.direction.x * deltaTimeMs * Ball.moveSpeed;
        this.position.y += this.direction.y * deltaTimeMs * Ball.moveSpeed;
        if (this.board.isBallCollidingWithPins(this)) {
            this.direction = MathUtils.directionFromAngle(Math.random() < 0.5 ? 45 : 135);
        }
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = Ball.color;
        ctx.arc(this.position.x, this.position.y, this.board.pinRadius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}
Ball.moveSpeed = 1;
Ball.color = '#689d6a';
export default Ball;

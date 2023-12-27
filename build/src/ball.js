class Ball {
    constructor(board, startPosition) {
        this.board = board;
        this.lastCollidedPinRowIdx = -1;
        this.position = { x: 0, y: 0 };
        this.direction = { x: 0, y: 1 };
        this.position = startPosition;
    }
    update(deltaTimeMs) {
        this.position.x += this.direction.x * deltaTimeMs * Ball.MOVE_SPEED;
        this.position.y += this.direction.y * deltaTimeMs * Ball.MOVE_SPEED;
        if (this.board.isBallCollidingWithPins(this)) {
            this.direction.x = Math.random() < 0.5 ? -1 : 1;
        }
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = Ball.COLOR;
        ctx.arc(this.position.x, this.position.y, Ball.RADIUS, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}
Ball.MOVE_SPEED = 1 / 10;
Ball.RADIUS = 8;
Ball.COLOR = '#00f';
export default Ball;

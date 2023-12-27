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
            alert('collided!');
        }
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, Ball.RADIUS, 0, 2 * Math.PI, false);
        ctx.fillStyle = Ball.COLOR;
        ctx.fill();
    }
}
Ball.MOVE_SPEED = 10;
Ball.RADIUS = 5;
Ball.COLOR = '#fff';
export default Ball;

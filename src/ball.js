import AudioSourcePool from './audioSourcePool.js';
import { MathUtils } from './math.js';
import { Options } from './options.js';
class Ball {
    constructor(startPosition) {
        this.startPosition = startPosition;
        this.queueDelete = false;
        this.position = { x: 0, y: 0 };
        this.timer = 0.0;
        this.lastPin = undefined;
        this.nextPin = { row: 0, idx: 0 };
        this.position = startPosition;
    }
    update(board, deltaTimeMs) {
        this.timer += deltaTimeMs;
        const previousPosition = this.lastPin ? board.getPinPosition(this.lastPin) : this.startPosition;
        const nextPosition = board.getPinPosition(this.nextPin);
        const t = Math.min(this.timer / Options.ballBounceTime, 1.0);
        this.position = this.bouncePosition(board, MathUtils.lerpVector2(previousPosition, nextPosition, t), t);
        if (t >= 1.0) {
            this.timer = 0.0;
            if (this.nextPin.row >= board.rowCount - 1) {
                this.queueDelete = true;
                board.registerHit(this.nextPin.idx);
                return;
            }
            this.calculateNextPin(board);
            Ball.bounceAudio.play();
        }
    }
    render(board, ctx) {
        ctx.beginPath();
        ctx.fillStyle = Ball.color;
        ctx.arc(this.position.x, this.position.y, board.pinRadius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
    calculateNextPin(board) {
        this.lastPin = this.nextPin;
        this.nextPin = board.getNextPin(this.lastPin);
    }
    bouncePosition(board, position, t) {
        const bounce = Math.sin(t * Math.PI);
        const bounceOffset = bounce * board.pinRadius * 3;
        return {
            x: position.x,
            y: position.y - bounceOffset
        };
    }
}
Ball.bounceAudio = new AudioSourcePool('audio/bounce.ogg', 15);
Ball.color = '#689d6a';
export default Ball;

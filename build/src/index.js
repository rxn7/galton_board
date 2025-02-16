import Ball from './ball.js';
import Board from './board.js';
const ctx = document.getElementById('canvas').getContext('2d');
const board = new Board();
const balls = [new Ball(board, { x: ctx.canvas.width * 0.5, y: 0 })];
let lastFrameTime = 0;
function gameLoop(time) {
    const deltaTimeMs = time - lastFrameTime;
    lastFrameTime = time;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    board.render(ctx);
    balls.forEach(ball => {
        ball.update(deltaTimeMs);
        ball.render(ctx);
    });
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

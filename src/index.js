import Ball from './ball.js';
import Board from './board.js';
const ctx = document.getElementById('canvas').getContext('2d');
const board = new Board(ctx.canvas, 128);
const balls = [];
let lastFrameTime = 0;
function gameLoop(time) {
    const deltaTimeMs = time - lastFrameTime;
    lastFrameTime = time;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    board.render(ctx);
    balls.forEach((ball, idx, object) => {
        ball.update(deltaTimeMs);
        if (ball.queueDelete) {
            object.splice(idx, 1);
            return;
        }
        ball.render(ctx);
    });
    requestAnimationFrame(gameLoop);
}
function spawnBall() {
    balls.push(new Ball(board, { x: ctx.canvas.clientWidth * 0.5, y: -board.pinRadius }));
    setTimeout(spawnBall, 500);
}
function init() {
    spawnBall();
    requestAnimationFrame(gameLoop);
    const resizeCanvas = () => {
        balls.length = 0;
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        board.onCanvasResize(ctx.canvas);
    };
    resizeCanvas();
    window.addEventListener('resize', () => resizeCanvas());
}
init();

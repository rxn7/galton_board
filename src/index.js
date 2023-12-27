import Ball from './ball.js';
import Board from './board.js';
const ballSpawnInterval = 200;
const minimunFps = 30;
const minimumDeltaTime = 1 / minimunFps;
const ctx = document.getElementById('canvas').getContext('2d', { alpha: false, willReadFrequently: false });
const board = new Board(ctx.canvas, 19);
const balls = [];
let lastFrameTime = 0;
function init() {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    spawnBall();
    const resizeCanvas = () => {
        balls.length = 0;
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        board.onCanvasResize(ctx.canvas);
    };
    resizeCanvas();
    window.addEventListener('resize', () => resizeCanvas());
    requestAnimationFrame(gameLoop);
}
function gameLoop(time) {
    const deltaTimeMs = Math.max(time - lastFrameTime, minimumDeltaTime);
    lastFrameTime = time;
    ctx.fillStyle = '#282828';
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
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
    setTimeout(spawnBall, ballSpawnInterval);
}
init();

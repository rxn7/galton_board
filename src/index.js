import Ball from './ball.js';
import Board from './board.js';
import { Options } from './options.js';
const minimunFps = 60;
const minimumDeltaTime = 1 / minimunFps;
export const ctx = document.getElementById('canvas').getContext('2d', { alpha: false, willReadFrequently: false });
let board = new Board(ctx.canvas, 19);
const balls = [];
let lastFrameTime = 0;
function init() {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const resizeCanvas = () => {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        board.onCanvasResize(ctx.canvas);
    };
    resizeCanvas();
    window.addEventListener('resize', () => resizeCanvas());
    requestAnimationFrame(gameLoop);
    spawnBall();
}
function gameLoop(time) {
    const deltaTimeMs = Math.max(time - lastFrameTime, minimumDeltaTime);
    lastFrameTime = time;
    ctx.fillStyle = '#282828';
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    board.render(ctx);
    balls.forEach((ball, idx, object) => {
        ball.update(board, deltaTimeMs);
        if (ball.queueDelete) {
            object.splice(idx, 1);
            return;
        }
        ball.render(board, ctx);
    });
    requestAnimationFrame(gameLoop);
}
function spawnBall() {
    balls.push(new Ball({ x: ctx.canvas.clientWidth * 0.5, y: -board.pinRadius }));
    setTimeout(spawnBall, Options.ballSpawnInterval);
}
export function recreateBoard(rowCount) {
    balls.length = 0;
    board = new Board(ctx.canvas, rowCount);
}
init();

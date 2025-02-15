import { recreateBoard } from "./index.js";
export var Options;
(function (Options) {
    const rowCountInput = document.getElementById('row-count-input');
    rowCountInput.addEventListener('input', (evt) => {
        const value = parseInt(evt.target.value);
        recreateBoard(value);
    });
    Options.ballBounceTime = 500;
    const ballBounceTimeInput = document.getElementById('ball-bounce-time-input');
    ballBounceTimeInput.value = Options.ballBounceTime.toString();
    ballBounceTimeInput.addEventListener('input', (evt) => {
        const value = parseInt(evt.target.value);
        Options.ballBounceTime = value;
    });
    Options.ballSpawnInterval = 500;
    const ballSpawnIntervalInput = document.getElementById('ball-spawn-interval-input');
    ballSpawnIntervalInput.value = Options.ballSpawnInterval.toString();
    ballSpawnIntervalInput.addEventListener('input', (evt) => {
        const value = parseInt(evt.target.value);
        Options.ballSpawnInterval = value;
    });
})(Options || (Options = {}));

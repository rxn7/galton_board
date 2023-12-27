export var AudioUtils;
(function (AudioUtils) {
    let pingSound;
    function init() {
        pingSound = new Audio();
        pingSound.src = 'audio/ping.wav';
        pingSound.preload = 'auto';
    }
    AudioUtils.init = init;
    function playPingSound() {
        pingSound.currentTime = 0.0;
        pingSound.play();
    }
    AudioUtils.playPingSound = playPingSound;
})(AudioUtils || (AudioUtils = {}));

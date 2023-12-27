export class Sound {
    constructor(src) {
        this.src = src;
        this.element = new Audio(src);
    }
    play() {
        const clone = this.element.cloneNode();
        clone.currentTime = 0;
        clone.play();
    }
}

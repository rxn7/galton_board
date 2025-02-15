export default class AudioSourcePool {
    constructor(url, poolSize = 10) {
        this.url = url;
        this.poolSize = poolSize;
        this.pool = [];
        const audio = new Audio(url);
        for (let i = 0; i < this.poolSize; ++i) {
            this.pool.push(this.createAudio(audio));
        }
    }
    createAudio(original) {
        const audio = original.cloneNode();
        audio.addEventListener('ended', () => {
            this.pool.push(audio);
        });
        return audio;
    }
    play() {
        if (this.pool.length === 0) {
            return;
        }
        const audio = this.pool.pop();
        audio.play();
    }
}

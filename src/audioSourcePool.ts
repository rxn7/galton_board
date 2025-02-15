export default class AudioSourcePool {
	private pool: Array<HTMLAudioElement> = []

	public constructor(private readonly url: string, private readonly poolSize = 10) {
		const audio = new Audio(url)
		for(let i = 0; i < this.poolSize; ++i) {
			this.pool.push(this.createAudio(audio))
		}
	}

	private createAudio(original: HTMLAudioElement): HTMLAudioElement {
		const audio: HTMLAudioElement = original.cloneNode() as HTMLAudioElement

		audio.addEventListener('ended', () => {
			this.pool.push(audio)
		})

		return audio
	}

	public play(): void {
		if(this.pool.length === 0) {
			return
		}

		const audio: HTMLAudioElement = this.pool.pop() as HTMLAudioElement
		audio.play()
	}
}

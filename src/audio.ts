export default class Sound {
	public static ctx: AudioContext = new AudioContext()
	private buffer?: AudioBuffer
	private gainNode: GainNode = Sound.ctx.createGain()

	public constructor(private readonly url: string, volume: number = 1.0) {
		this.load()
		this.gainNode.gain.value = volume
		this.gainNode.connect(Sound.ctx.destination)
	}

	private async load(): Promise<void> {
		const response = await fetch(this.url)
		const arrayBuffer = await response.arrayBuffer()
		this.buffer = await Sound.ctx.decodeAudioData(arrayBuffer)
	}

	public play(pitch: number = 1.0): void {
		const source = Sound.ctx.createBufferSource()
		source.buffer = this.buffer as AudioBuffer
		source.connect(this.gainNode)
		source.playbackRate.value = pitch
		source.start()
	}
}

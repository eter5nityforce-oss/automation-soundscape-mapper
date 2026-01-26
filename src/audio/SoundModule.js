export class SoundModule {
    constructor(ctx) {
        this.ctx = ctx;
        this.output = this.ctx.createGain();
    }

    connect(destination) {
        this.output.connect(destination);
    }

    update(data) {
        // To be implemented by subclasses
    }

    // Helper to create oscillators
    createOsc(type, freq) {
        const osc = this.ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        return osc;
    }
}

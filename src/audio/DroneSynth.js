import { SoundModule } from './SoundModule.js';

export class DroneSynth extends SoundModule {
    constructor(ctx) {
        super(ctx);

        // Carrier
        this.carrier = this.ctx.createOscillator();
        this.carrier.type = 'sine';
        this.carrier.frequency.value = 110; // A2

        // Modulator
        this.modulator = this.ctx.createOscillator();
        this.modulator.type = 'triangle';
        this.modulator.frequency.value = 55; // A1

        // Modulation Gain (Index)
        this.modGain = this.ctx.createGain();
        this.modGain.gain.value = 0;

        // Filter
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 500;
        this.filter.Q.value = 1;

        // Connections
        this.modulator.connect(this.modGain);
        this.modGain.connect(this.carrier.frequency);

        this.carrier.connect(this.filter);
        this.filter.connect(this.output);

        this.started = false;

        // Initial volume
        this.output.gain.value = 0.3;
    }

    start() {
        if (!this.started) {
            this.carrier.start();
            this.modulator.start();
            this.started = true;
        }
    }

    update(data) {
        if (!this.started) this.start();

        // data.avgCpu -> Modulation Index and Filter Cutoff
        // data.avgMem -> Carrier Frequency (pitch shift)

        const cpu = data.avgCpu; // 0.0 - 1.0 (can go higher momentarily)
        const mem = data.avgMem;

        const now = this.ctx.currentTime;
        const rampTime = 0.1;

        // Map CPU to modulation depth (richer timbre)
        // range 0 -> 1000
        this.modGain.gain.setTargetAtTime(cpu * 500, now, rampTime);

        // Map CPU to Filter cutoff (brighter)
        // range 200 -> 3000
        const cutoff = 200 + (cpu * 2800);
        this.filter.frequency.setTargetAtTime(cutoff, now, rampTime);

        // Map Memory to slight detune or pitch shift
        // range 100 -> 150 Hz base
        const baseFreq = 110 + (mem * 40);
        this.carrier.frequency.setTargetAtTime(baseFreq, now, rampTime);

        // Modulator harmonicity changes with CPU too
        // 0.5 ratio (octave down) to 2.0 (octave up)
        const modRatio = 0.5 + (cpu * 1.5);
        this.modulator.frequency.setTargetAtTime(baseFreq * modRatio, now, rampTime);
    }
}

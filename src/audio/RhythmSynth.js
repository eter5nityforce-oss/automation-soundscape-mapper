import { SoundModule } from './SoundModule.js';

export class RhythmSynth extends SoundModule {
    constructor(ctx) {
        super(ctx);
        this.nextTriggerTime = 0;
        this.output.gain.value = 0.4;
    }

    update(data) {
        // data.avgNet: 0.0 - 1.0

        const load = data.avgNet;

        // Ensure we are initialized
        if (this.nextTriggerTime === 0) {
            this.nextTriggerTime = this.ctx.currentTime;
        }

        // Check if it's time to trigger
        if (this.ctx.currentTime >= this.nextTriggerTime) {
            if (load > 0.05) {
                this.triggerPing(load);
            }

            // Calculate next trigger time based on load
            // High load = short interval
            // 0.1 load -> 500ms
            // 1.0 load -> 50ms
            const interval = 0.05 + (1.0 - Math.min(1, load)) * 0.5;
            this.nextTriggerTime = this.ctx.currentTime + interval;
        }
    }

    triggerPing(intensity) {
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.output);

        // Sound design: High pitched blip
        // Pitch varies slightly
        const freq = 800 + Math.random() * 400 + (intensity * 1000);
        osc.frequency.value = freq;
        osc.type = 'sine';

        // Filter envelope (pluck)
        filter.type = 'bandpass';
        filter.Q.value = 10;
        filter.frequency.value = freq;

        // Amplitude envelope
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3 * intensity, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.start(t);
        osc.stop(t + 0.15);

        // Cleanup (simplified, in real engine we'd pool these)
        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
            filter.disconnect();
        }, 200);
    }
}

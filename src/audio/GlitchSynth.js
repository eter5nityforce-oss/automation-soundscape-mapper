import { SoundModule } from './SoundModule.js';

export class GlitchSynth extends SoundModule {
    constructor(ctx) {
        super(ctx);
        this.output.gain.value = 0.5;
        this.lastErrorCount = 0;
    }

    update(data) {
        // data.totalErr is a continuous value (decaying count)
        const currentErr = data.totalErr;

        // Trigger sound if there's significant error activity
        // We can use a probability based on the magnitude of error

        if (currentErr > 0.1 && Math.random() < (currentErr * 0.1)) {
            this.triggerGlitch(currentErr);
        }
    }

    triggerGlitch(severity) {
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const shaper = this.ctx.createWaveShaper();

        // Create distortion curve
        shaper.curve = this.makeDistortionCurve(400);
        shaper.oversample = '4x';

        osc.connect(shaper);
        shaper.connect(gain);
        gain.connect(this.output);

        // Sawtooth or Square for harshness
        osc.type = Math.random() < 0.5 ? 'sawtooth' : 'square';

        // Random low or very high frequency
        const freq = Math.random() < 0.5 ? 50 + Math.random() * 50 : 2000 + Math.random() * 1000;
        osc.frequency.setValueAtTime(freq, t);

        // Slide frequency down or up rapidly
        osc.frequency.exponentialRampToValueAtTime(freq / 2, t + 0.1);

        // Envelope
        gain.gain.setValueAtTime(0.5 * Math.min(1, severity / 5), t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1 + Math.random() * 0.2);

        osc.start(t);
        osc.stop(t + 0.3);

        setTimeout(() => {
            osc.disconnect();
            gain.disconnect();
            shaper.disconnect();
        }, 350);
    }

    makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;

        for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }
}

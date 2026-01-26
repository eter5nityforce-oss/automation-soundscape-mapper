export class AudioManager {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = null;
        this.compressor = null;
        this.isInitialized = false;
        this.modules = [];

        // Setup graph immediately (context is suspended)
        this.setupGraph();
    }

    setupGraph() {
        // Master Chain: Modules -> Compressor -> Master Gain -> Destination
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.5; // Start at reasonable volume

        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.value = -10;
        this.compressor.knee.value = 40;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0;
        this.compressor.release.value = 0.25;

        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this.isInitialized = true;
    }

    async resume() {
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    toggleMute(isMuted) {
        if (isMuted) {
            this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
        } else {
            this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.1);
        }
    }

    getDestination() {
        return this.compressor;
    }

    registerModule(module) {
        module.connect(this.getDestination());
        this.modules.push(module);
    }

    update(data) {
        this.modules.forEach(m => m.update(data));
    }
}

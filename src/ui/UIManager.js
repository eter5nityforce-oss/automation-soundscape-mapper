export class UIManager {
    constructor(simulator, audioManager) {
        this.sim = simulator;
        this.audio = audioManager;

        // Elements
        this.btnStart = document.getElementById('btn-start');
        this.btnStop = document.getElementById('btn-stop');
        this.btnReset = document.getElementById('btn-reset');

        this.btnLoad = document.getElementById('btn-load-spike');
        this.btnNet = document.getElementById('btn-network-pulse');
        this.btnErr = document.getElementById('btn-error-burst');

        this.btnAudioInit = document.getElementById('btn-audio-init');
        this.chkMute = document.getElementById('chk-mute');

        this.valCpu = document.getElementById('val-cpu');
        this.valMem = document.getElementById('val-mem');
        this.valNet = document.getElementById('val-net');
        this.valErr = document.getElementById('val-err');

        this.bindEvents();
    }

    bindEvents() {
        this.btnStart.addEventListener('click', () => {
            this.sim.start();
            this.btnStart.disabled = true;
            this.btnStop.disabled = false;
        });

        this.btnStop.addEventListener('click', () => {
            this.sim.stop();
            this.btnStart.disabled = false;
            this.btnStop.disabled = true;
        });

        this.btnReset.addEventListener('click', () => {
            this.sim.reset();
        });

        this.btnLoad.addEventListener('click', () => this.sim.triggerLoadSpike());
        this.btnNet.addEventListener('click', () => this.sim.triggerNetworkPulse());
        this.btnErr.addEventListener('click', () => this.sim.triggerErrorBurst());

        this.btnAudioInit.addEventListener('click', async () => {
            await this.audio.resume();
            this.btnAudioInit.textContent = "Audio Initialized";
            this.btnAudioInit.disabled = true;
        });

        this.chkMute.addEventListener('change', (e) => {
            this.audio.toggleMute(e.target.checked);
        });
    }

    update(data) {
        // Update DOM elements with data
        this.valCpu.textContent = Math.round(data.avgCpu * 100) + '%';
        this.valMem.textContent = Math.round(data.avgMem * 100) + '%';
        this.valNet.textContent = Math.round(data.avgNet * 1000) + ' Mbps';
        this.valErr.textContent = data.totalErr.toFixed(1) + '/s';

        // Update color/intensity based on thresholds
        this.valCpu.style.color = data.avgCpu > 0.8 ? '#f44336' : '#e0e0e0';
    }
}

import { Process } from './Process.js';

export class Simulator {
    constructor(processCount = 4) {
        this.processes = [];
        for (let i = 0; i < processCount; i++) {
            this.processes.push(new Process(i));
        }

        this.isRunning = false;
        this.lastTime = 0;
        this.callbacks = [];
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }

    stop() {
        this.isRunning = false;
    }

    reset() {
        this.processes.forEach(p => {
            p.cpu = 0.2;
            p.memory = 0.3;
            p.network = 0;
            p.errors = 0;
        });
        this.notify();
    }

    onUpdate(callback) {
        this.callbacks.push(callback);
    }

    notify() {
        const data = this.getAggregateData();
        this.callbacks.forEach(cb => cb(data));
    }

    loop() {
        if (!this.isRunning) return;

        const now = performance.now();
        const dt = (now - this.lastTime) / 1000; // Delta time in seconds
        this.lastTime = now;

        this.processes.forEach(p => p.update(dt));

        this.notify();

        requestAnimationFrame(() => this.loop());
    }

    getAggregateData() {
        // Calculate average metrics
        let totalCpu = 0;
        let totalMem = 0;
        let totalNet = 0;
        let totalErr = 0;

        this.processes.forEach(p => {
            totalCpu += p.cpu;
            totalMem += p.memory;
            totalNet += p.network;
            totalErr += p.errors;
        });

        const count = this.processes.length;

        return {
            processes: this.processes, // Return raw objects for detailed visualization
            avgCpu: totalCpu / count,
            avgMem: totalMem / count,
            avgNet: totalNet / count,
            totalErr: totalErr
        };
    }

    // Intervention methods
    triggerLoadSpike() {
        // Affect a random process or all
        this.processes.forEach(p => {
            if (Math.random() < 0.5) p.triggerLoadSpike();
        });
    }

    triggerNetworkPulse() {
        this.processes.forEach(p => p.triggerNetworkPulse());
    }

    triggerErrorBurst() {
        // Trigger error on random process
        const randomIdx = Math.floor(Math.random() * this.processes.length);
        this.processes[randomIdx].triggerError();
    }
}

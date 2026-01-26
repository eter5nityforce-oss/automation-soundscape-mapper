export class Process {
    constructor(id) {
        this.id = id;
        this.cpu = 0.2 + Math.random() * 0.1; // 0.0 to 1.0
        this.memory = 0.3 + Math.random() * 0.1; // 0.0 to 1.0
        this.network = 0.0; // 0.0 to 1.0 (normalized throughput)
        this.errors = 0; // Events per second equivalent
        this.state = 'IDLE'; // IDLE, ACTIVE, ERROR

        // Internal oscillation parameters for organic movement
        this.t = Math.random() * 100;
        this.cpuSpeed = 0.01 + Math.random() * 0.02;
        this.memSpeed = 0.005 + Math.random() * 0.01;
    }

    update(dt) {
        this.t += dt;

        // Simulate organic CPU load fluctuation
        // Base sine wave + Perlin-ish noise (simulated by summing sines)
        let targetCpu = 0.3 +
                        0.2 * Math.sin(this.t * this.cpuSpeed) +
                        0.1 * Math.sin(this.t * this.cpuSpeed * 2.5);

        // Clamp and smooth approach
        targetCpu = Math.max(0, Math.min(1, targetCpu));
        this.cpu += (targetCpu - this.cpu) * 0.05;

        // Memory usually grows slowly then drops (GC)
        this.memory += 0.001 * dt;
        if (this.memory > 0.8 && Math.random() < 0.05) {
            this.memory = 0.3; // GC event
        }

        // Network traffic is bursty
        if (Math.random() < 0.05) {
            this.network = 0.5 + Math.random() * 0.5;
        } else {
            this.network *= 0.9; // Decay
        }

        // Error probability checks
        if (this.errors > 0) {
            this.errors -= dt * 2; // Errors decay
            if (this.errors < 0) this.errors = 0;
        }

        // Determine state
        if (this.errors > 0.5) {
            this.state = 'ERROR';
        } else if (this.cpu > 0.6 || this.network > 0.3) {
            this.state = 'ACTIVE';
        } else {
            this.state = 'IDLE';
        }
    }

    triggerLoadSpike() {
        this.cpu = 1.0;
        this.memory += 0.2;
    }

    triggerNetworkPulse() {
        this.network = 1.0;
    }

    triggerError() {
        this.errors += 5.0;
    }
}

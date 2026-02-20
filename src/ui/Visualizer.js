export class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // Get parent container dimensions
        const container = this.canvas.parentElement;
        this.width = container.clientWidth;
        this.height = container.clientHeight || 400; // Fallback

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    draw(data) {
        // Clear screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Trails effect
        this.ctx.fillRect(0, 0, this.width, this.height);

        const centerX = this.width / 2;
        const centerY = this.height / 2;

        const processes = data.processes;
        const count = processes.length;
        const radius = Math.min(this.width, this.height) * 0.35;

        // Draw Center Hub
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 20 + data.avgCpu * 20, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsl(180, 100%, ${20 + data.avgNet * 50}%)`;
        this.ctx.fill();
        this.ctx.closePath();

        // Draw Orbiting Processes
        processes.forEach((p, i) => {
            const angle = (i / count) * Math.PI * 2 + (performance.now() * 0.0005 * (p.cpu + 0.5));
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Size based on Memory
            const size = 10 + p.memory * 20;

            // Color based on State/CPU
            let color = '#00bcd4';
            if (p.state === 'ERROR') color = '#f44336';
            else if (p.state === 'ACTIVE') color = `hsl(${120 - p.cpu * 60}, 100%, 50%)`; // Green to Yellow/Red
            else color = '#555';

            // Connection line (Network)
            if (p.network > 0.1) {
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);
                this.ctx.lineTo(x, y);
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${p.network})`;
                this.ctx.lineWidth = 1 + p.network * 4;
                this.ctx.stroke();
                this.ctx.closePath();
            }

            // Node
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // Error halo
            if (p.errors > 0.1) {
                this.ctx.strokeStyle = '#f44336';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size + 5 + Math.random() * 5, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });
    }
}

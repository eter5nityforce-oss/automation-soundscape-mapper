import { Simulator } from './simulation/Simulator.js';
import { AudioManager } from './audio/AudioManager.js';
import { DroneSynth } from './audio/DroneSynth.js';
import { RhythmSynth } from './audio/RhythmSynth.js';
import { GlitchSynth } from './audio/GlitchSynth.js';
import { Visualizer } from './ui/Visualizer.js';
import { UIManager } from './ui/UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Automation System Auditory Analyzer...');

    // 1. Initialize Components
    const simulator = new Simulator(5);
    const audioManager = new AudioManager();
    const visualizer = new Visualizer('visualizer');
    const uiManager = new UIManager(simulator, audioManager);

    // 2. Setup Audio Graph
    const drone = new DroneSynth(audioManager.ctx);
    const rhythm = new RhythmSynth(audioManager.ctx);
    const glitch = new GlitchSynth(audioManager.ctx);

    audioManager.registerModule(drone);
    audioManager.registerModule(rhythm);
    audioManager.registerModule(glitch);

    // 3. Connect Loops
    simulator.onUpdate((data) => {
        // Update Audio
        audioManager.update(data);

        // Update UI Metrics
        uiManager.update(data);

        // Update Visualizer
        visualizer.draw(data);
    });

    // Start render loop for visualizer if needed, but we are driving it from simulator
    // which runs on requestAnimationFrame loop.
    // However, simulator loop only runs when started.
    // We want visualizer to render idle state too?
    // Simulator.start() is manual.

    // Let's modify Simulator to run loop always but only update physics if running?
    // Or just start the visualizer loop independently?

    // Better: Visualizer has its own draw loop if we want smooth animation even when paused?
    // No, "paused" simulation means data doesn't change. Visualizer should reflect that static data.
    // But our visualizer has "orbiting" animation which depends on time.
    // If we only draw on simulator update, and simulator stops, the visualization freezes.

    // Ideally, Visualizer should have its own loop and pull data.
    // OR Simulator continues to loop but dt = 0 if paused?
    // Let's keep it simple: Simulator loop drives everything. When stopped, it freezes.
});

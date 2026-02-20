# Automation System Auditory Analyzer

A browser-based interactive project that generates evolving soundscapes to sonify the state and activity of complex simulated automated processes. This tool allows users to 'listen' to systems, enabling passive monitoring and real-time anomaly detection through sound.

## Features

- **Modular WebAudio Engine**: Utilizes additive, subtractive, and FM synthesis to create rich soundscapes.
- **Real-time Sonification**: Maps abstract metrics (CPU load, memory usage, network traffic, error rates) to audio parameters (pitch, timbre, rhythmic density, distortion).
- **Client-side Simulation**: Simulates multiple concurrent processes with organic load fluctuations and random events.
- **Interactive Controls**: Users can trigger load spikes, network pulses, and error bursts to hear the system's reaction.
- **Abstract Visualization**: A canvas-based visualizer that complements the auditory experience.

## Demo: How to Run

Since this project uses ES modules, it requires a local web server to run correctly (browsers block file:// protocol for modules due to CORS).

### Option 1: Using Python (Recommended)

If you have Python installed:

1.  Open a terminal/command prompt.
2.  Navigate to the project root directory.
3.  Run the following command:
    ```bash
    # Python 3
    python -m http.server 8000
    ```
4.  Open your browser and visit: `http://localhost:8000`

### Option 2: Using Node.js

If you have Node.js and `npm` or `npx`:

1.  Open a terminal.
2.  Run:
    ```bash
    npx serve
    ```
3.  Visit the URL shown in the terminal (usually `http://localhost:3000`).

### Instructions

1.  **Initialize Audio**: Click the "Initialize Audio" button to enable the sound engine (browser policy requires user gesture).
2.  **Start Simulation**: Click "Start Simulation" to begin the data generation.
3.  **Listen**:
    - **Drone/Texture**: Represents CPU and Memory load. Higher pitch/brightness = higher load.
    - **Rhythmic Pulses**: Represent Network traffic. Faster/more intense pulses = high throughput.
    - **Glitches/Distortion**: Represent Errors. Harsh noises indicate system anomalies.
4.  **Intervene**: Use the "Interventions" buttons to stress-test the system and hear the results.

## Project Structure

- `index.html`: Main entry point.
- `style.css`: Application styling.
- `src/`: Source code.
    - `main.js`: Application bootstrapper.
    - `audio/`: WebAudio engine components (`AudioManager`, `SoundModule`, synthesizers).
    - `simulation/`: Logic for simulating automated processes (`Simulator`, `Process`).
    - `ui/`: Visualization and DOM interaction (`Visualizer`, `UIManager`).

## Technical Details

The project is built with Vanilla JavaScript and the Web Audio API. It uses no external libraries.
- **Simulation**: Runs a physics-inspired simulation loop to generate organic data curves.
- **Audio**: Uses a custom modular graph with Oscillators, GainNodes, BiquadFilters, and WaveShapers.
- **Visualization**: HTML5 Canvas rendering linked to the simulation state.

# Psi-AceHack 🧠

*Public Space Intelligence 🧠* is an AI-powered computer vision project built for hackathons. It performs real-time face detection, pose tracking, hand and gesture recognition, and more—all in one unified toolkit that runs in both browsers and Node.js.

## Overview

- *Real-Time AI:* Detect faces, track body poses, and recognize hand gestures from images or video.
- *Multi-Platform:* Works in modern browsers (using WebGL/WASM) and on Node.js.
- *Modular Design:* Choose only the modules you need and prototype interactive demos quickly.

## Features

- *3D Face Detection & Tracking:* Detect and track face orientation.
- *Pose & Gesture Recognition:* Monitor body poses and hand gestures.
- *Smooth Performance:* Utilize smart buffering and result interpolation for fluid visuals.
- *Simple API:* Easily integrate into web apps and server applications.

## Usage

Below is a basic HTML example to capture video input and display processed results on a canvas.

html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Psi-AceHack Demo</title>
  </head>
  <body>
    <video id="video" autoplay playsinline></video>
    <canvas id="canvas"></canvas>
    <script src="dist/app.js"></script>
    <script>
      // Create an instance of your AI toolkit with desired settings.
      const aiToolkit = new AIToolkit({ backend: 'webgl' });
      const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');

      async function init() {
        await aiToolkit.startWebcam({ crop: true });
        aiToolkit.listenToVideo(video);
        processFrame();
      }

      async function processFrame() {
        const result = await aiToolkit.detect(video);
        aiToolkit.render(canvas, result);
        requestAnimationFrame(processFrame);
      }

      init();
    </script>
  </body>
</html>


Note: Replace AIToolkit with your actual class or object name as defined in your project.

## Project Structure

- */src:* Core source code.
- */dist:* Compiled bundles for browsers and Node.js.
- */demo:* Demos showcasing various functionalities such as face detection and gesture recognition.
- */models:* Pre-trained models loaded at runtime.

## Future Enhancements

- Add additional backend support (e.g., WebGPU).
- Increase the range of gesture and pose recognition options.
- Improve the UI for demo visualizations and interactive experiences.

## Team

- *Project Lead:* Sajal Jha
- *Team Members:* Pratibha Naulakha, Piyush Anand, Prabhat Teotia

## License

This project is licensed under the MIT License.


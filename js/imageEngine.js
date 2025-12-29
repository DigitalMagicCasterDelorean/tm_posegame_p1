/**
 * imageEngine.js
 * Webcam + TM Image Model loading and prediction
 * 
 * Teachable Machine Image model for hand gesture recognition
 */

class ImageEngine {
    constructor(modelURL = "./RPS_tensorflow.js/") {
        this.modelURL = modelURL;
        this.model = null;
        this.webcam = null;
        this.maxPredictions = 0;
        this.isRunning = false;
        this.animationId = null;
        this.onPrediction = null; // Prediction callback
        this.onDraw = null; // Draw callback
    }

    /**
     * Initialize model and webcam
     * @param {Object} options - Options { size, flip }
     */
    async init(options = {}) {
        const { size = 200, flip = true } = options;

        // Load model
        const modelURL = this.modelURL + "model.json";
        const metadataURL = this.modelURL + "metadata.json";

        // Load Teachable Machine Image model
        this.model = await tmImage.load(modelURL, metadataURL);
        this.maxPredictions = this.model.getTotalClasses();

        // Setup webcam
        this.webcam = new tmImage.Webcam(size, size, flip);
        await this.webcam.setup();
        await this.webcam.play();

        return {
            maxPredictions: this.maxPredictions,
            webcam: this.webcam
        };
    }

    /**
     * Start prediction loop
     */
    start() {
        this.isRunning = true;
        this.loop();
    }

    /**
     * Stop prediction loop
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            window.cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.webcam) {
            this.webcam.stop();
        }
    }

    /**
     * Main prediction loop
     */
    async loop() {
        if (!this.isRunning) return;

        this.webcam.update(); // Update webcam frame
        await this.predict();
        this.animationId = window.requestAnimationFrame(() => this.loop());
    }

    /**
     * Perform prediction
     */
    async predict() {
        // Get prediction from image model
        const prediction = await this.model.predict(this.webcam.canvas);

        // Call callbacks
        if (this.onPrediction) {
            this.onPrediction(prediction);
        }

        if (this.onDraw) {
            this.onDraw();
        }

        return { prediction };
    }

    /**
     * Set prediction callback
     * @param {Function} callback - (prediction) => void
     */
    setPredictionCallback(callback) {
        this.onPrediction = callback;
    }

    /**
     * Set draw callback
     * @param {Function} callback - () => void
     */
    setDrawCallback(callback) {
        this.onDraw = callback;
    }

    /**
     * Get max predictions
     */
    getMaxPredictions() {
        return this.maxPredictions;
    }
}

// Export to global scope
window.ImageEngine = ImageEngine;

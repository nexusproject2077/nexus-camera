// ===================================
// NEXUS CAMERA - Advanced Camera App
// ===================================

class NexusCamera {
    constructor() {
        // Elements
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.effectCanvas = document.getElementById('effectCanvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.effectCtx = this.effectCanvas.getContext('2d');

        // State
        this.stream = null;
        this.currentMode = 'photo';
        this.currentFilter = 'none';
        this.currentCreativeMode = null;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.facingMode = 'user';
        this.timerSeconds = 0;

        // Settings
        this.settings = {
            photoQuality: 0.95,
            videoResolution: 1080,
            defaultTimer: 0,
            sound: true,
            metadata: true
        };

        // Manual controls
        this.controls = {
            brightness: 0,
            contrast: 100,
            saturation: 100,
            sharpness: 0,
            blur: 0,
            vignette: 0
        };

        // Gallery
        this.gallery = JSON.parse(localStorage.getItem('nexusGallery')) || [];

        // Animation frame
        this.animationFrame = null;

        // Particle system
        this.particles = [];

        this.init();
    }

    async init() {
        try {
            await this.setupCamera();
            this.setupEventListeners();
            this.startVideoProcessing();
            this.loadSettings();
            this.updateGallery();
            this.showToast('Caméra prête !', 'success');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showToast('Erreur d\'accès à la caméra', 'error');
        }
    }

    async setupCamera() {
        const constraints = {
            video: {
                facingMode: this.facingMode,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: this.currentMode === 'video'
        };

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.video.srcObject = this.stream;

        // Wait for video to be ready
        await new Promise(resolve => {
            this.video.onloadedmetadata = () => {
                this.video.play();
                resolve();
            };
        });

        // Setup canvas sizes
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.effectCanvas.width = this.video.videoWidth;
        this.effectCanvas.height = this.video.videoHeight;
    }

    setupEventListeners() {
        // Mode switching
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMode = e.target.dataset.mode;
            });
        });

        // Capture button
        document.getElementById('captureBtn').addEventListener('click', () => this.handleCapture());

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentFilter = e.currentTarget.dataset.filter;
            });
        });

        // Creative modes
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const wasActive = e.currentTarget.classList.contains('active');
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));

                if (wasActive) {
                    this.currentCreativeMode = null;
                } else {
                    e.currentTarget.classList.add('active');
                    this.currentCreativeMode = e.currentTarget.dataset.mode;
                }
            });
        });

        // Manual controls
        document.getElementById('brightnessSlider').addEventListener('input', (e) => {
            this.controls.brightness = parseInt(e.target.value);
        });
        document.getElementById('contrastSlider').addEventListener('input', (e) => {
            this.controls.contrast = parseInt(e.target.value);
        });
        document.getElementById('saturationSlider').addEventListener('input', (e) => {
            this.controls.saturation = parseInt(e.target.value);
        });
        document.getElementById('sharpnessSlider').addEventListener('input', (e) => {
            this.controls.sharpness = parseInt(e.target.value);
        });
        document.getElementById('blurSlider').addEventListener('input', (e) => {
            this.controls.blur = parseInt(e.target.value);
        });
        document.getElementById('vignetteSlider').addEventListener('input', (e) => {
            this.controls.vignette = parseInt(e.target.value);
        });

        // Header buttons
        document.getElementById('galleryBtn').addEventListener('click', () => this.openGallery());
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());

        // Bottom controls
        document.getElementById('switchCameraBtn').addEventListener('click', () => this.switchCamera());
        document.getElementById('effectsBtn').addEventListener('click', () => this.toggleSidePanel());
        document.getElementById('gridBtn').addEventListener('click', () => this.toggleGrid());
        document.getElementById('histogramBtn').addEventListener('click', () => this.toggleHistogram());
        document.getElementById('flashBtn').addEventListener('click', () => this.toggleFlash());
        document.getElementById('timerBtn').addEventListener('click', () => this.cycleTimer());

        // Modals
        document.getElementById('closeGalleryBtn').addEventListener('click', () => this.closeGallery());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.closeSettings());
        document.getElementById('closePanelBtn').addEventListener('click', () => this.toggleSidePanel());

        // Click on modal background to close
        document.getElementById('galleryModal').addEventListener('click', (e) => {
            if (e.target.id === 'galleryModal') this.closeGallery();
        });
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') this.closeSettings();
        });

        // Settings
        document.getElementById('photoQuality').addEventListener('change', (e) => {
            this.settings.photoQuality = parseFloat(e.target.value);
            this.saveSettings();
        });
        document.getElementById('videoResolution').addEventListener('change', (e) => {
            this.settings.videoResolution = parseInt(e.target.value);
            this.saveSettings();
        });
        document.getElementById('defaultTimer').addEventListener('change', (e) => {
            this.settings.defaultTimer = parseInt(e.target.value);
            this.saveSettings();
        });
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.settings.sound = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('metadataToggle').addEventListener('change', (e) => {
            this.settings.metadata = e.target.checked;
            this.saveSettings();
        });

        // Video container click for focus
        document.querySelector('.video-container').addEventListener('click', (e) => {
            this.showFocusIndicator(e.clientX, e.clientY);
        });
    }

    startVideoProcessing() {
        const processFrame = () => {
            if (!this.video.paused && !this.video.ended) {
                // Draw video to canvas
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

                // Apply filters and effects
                this.applyManualControls();
                this.applyFilter();
                this.applyCreativeMode();

                // Update histogram if visible
                if (!document.getElementById('histogram').classList.contains('hidden')) {
                    this.updateHistogram();
                }
            }

            this.animationFrame = requestAnimationFrame(processFrame);
        };

        processFrame();
    }

    applyManualControls() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        // Apply brightness and contrast
        const brightness = this.controls.brightness;
        const contrast = (this.controls.contrast - 100) * 2.55;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
            // Contrast
            data[i] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;

            // Brightness
            data[i] += brightness;
            data[i + 1] += brightness;
            data[i + 2] += brightness;

            // Saturation
            const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
            const saturation = this.controls.saturation / 100;
            data[i] = gray + (data[i] - gray) * saturation;
            data[i + 1] = gray + (data[i + 1] - gray) * saturation;
            data[i + 2] = gray + (data[i + 2] - gray) * saturation;

            // Clamp values
            data[i] = Math.max(0, Math.min(255, data[i]));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
        }

        this.ctx.putImageData(imageData, 0, 0);

        // Apply blur
        if (this.controls.blur > 0) {
            this.ctx.filter = `blur(${this.controls.blur}px)`;
            this.ctx.drawImage(this.canvas, 0, 0);
            this.ctx.filter = 'none';
        }

        // Apply vignette
        if (this.controls.vignette > 0) {
            this.applyVignette(this.controls.vignette / 100);
        }
    }

    applyFilter() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        switch (this.currentFilter) {
            case 'vintage':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    data[i] = r * 0.9 + g * 0.5 + b * 0.1;
                    data[i + 1] = r * 0.3 + g * 0.8 + b * 0.1;
                    data[i + 2] = r * 0.2 + g * 0.3 + b * 0.5;
                }
                break;

            case 'cyberpunk':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i] * 0.5;
                    data[i + 1] = data[i + 1] * 1.2;
                    data[i + 2] = data[i + 2] * 1.5;
                }
                break;

            case 'vaporwave':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i] * 1.3;
                    data[i + 1] = data[i + 1] * 0.8;
                    data[i + 2] = data[i + 2] * 1.5;
                }
                break;

            case 'noir':
                for (let i = 0; i < data.length; i += 4) {
                    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                }
                break;

            case 'glitch':
                this.applyGlitchEffect(data);
                break;

            case 'neon':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.5);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.3);
                    data[i + 2] = Math.min(255, data[i + 2] * 1.8);
                }
                break;

            case 'thermal':
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    if (avg < 85) {
                        data[i] = 0;
                        data[i + 1] = 0;
                        data[i + 2] = avg * 3;
                    } else if (avg < 170) {
                        data[i] = (avg - 85) * 3;
                        data[i + 1] = avg * 1.5;
                        data[i + 2] = 0;
                    } else {
                        data[i] = 255;
                        data[i + 1] = (255 - avg) * 3;
                        data[i + 2] = 0;
                    }
                }
                break;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    applyGlitchEffect(data) {
        const glitchIntensity = 0.05;
        const width = this.canvas.width;

        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < glitchIntensity) {
                const offset = Math.floor(Math.random() * 20 - 10) * 4;
                const sourceIndex = Math.max(0, Math.min(data.length - 4, i + offset));

                data[i] = data[sourceIndex];
                data[i + 1] = data[sourceIndex + 1];
                data[i + 2] = data[sourceIndex + 2];
            }

            // RGB split
            if (Math.random() < 0.01) {
                data[i] = data[Math.min(data.length - 4, i + 8)];
                data[i + 2] = data[Math.max(0, i - 8)];
            }
        }
    }

    applyCreativeMode() {
        this.effectCtx.clearRect(0, 0, this.effectCanvas.width, this.effectCanvas.height);

        switch (this.currentCreativeMode) {
            case 'particles':
                this.renderParticles();
                break;

            case 'double-exposure':
                this.applyDoubleExposure();
                break;

            case 'portrait':
                this.applyPortraitMode();
                break;

            case 'kaleidoscope':
                this.applyKaleidoscope();
                break;

            case 'pixelate':
                this.applyPixelate();
                break;

            case 'face-ar':
                // Face AR would require face detection library
                this.showToast('Mode AR en développement', 'warning');
                break;
        }
    }

    renderParticles() {
        // Add new particles
        if (Math.random() < 0.3) {
            this.particles.push({
                x: Math.random() * this.effectCanvas.width,
                y: this.effectCanvas.height,
                vx: Math.random() * 2 - 1,
                vy: -Math.random() * 3 - 1,
                life: 1.0,
                size: Math.random() * 4 + 2
            });
        }

        // Update and draw particles
        this.effectCtx.fillStyle = 'rgba(0, 243, 255, 0.8)';
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;

            if (p.life > 0) {
                this.effectCtx.globalAlpha = p.life;
                this.effectCtx.beginPath();
                this.effectCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.effectCtx.fill();
                return true;
            }
            return false;
        });
        this.effectCtx.globalAlpha = 1;
    }

    applyDoubleExposure() {
        // Create a mirrored/shifted version
        this.effectCtx.globalAlpha = 0.5;
        this.effectCtx.drawImage(this.canvas, this.canvas.width * 0.1, this.canvas.height * 0.1,
            this.canvas.width * 0.8, this.canvas.height * 0.8);
        this.effectCtx.globalAlpha = 1;
    }

    applyPortraitMode() {
        // Simple blur around edges (simulated depth of field)
        const gradient = this.effectCtx.createRadialGradient(
            this.effectCanvas.width / 2, this.effectCanvas.height / 2, this.effectCanvas.width * 0.3,
            this.effectCanvas.width / 2, this.effectCanvas.height / 2, this.effectCanvas.width * 0.6
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

        this.effectCtx.fillStyle = gradient;
        this.effectCtx.fillRect(0, 0, this.effectCanvas.width, this.effectCanvas.height);
    }

    applyKaleidoscope() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const segments = 8;

        for (let i = 0; i < segments; i++) {
            this.effectCtx.save();
            this.effectCtx.translate(centerX, centerY);
            this.effectCtx.rotate((i * Math.PI * 2) / segments);
            this.effectCtx.scale(i % 2 === 0 ? 1 : -1, 1);
            this.effectCtx.drawImage(this.canvas, -centerX, -centerY);
            this.effectCtx.restore();
        }
    }

    applyPixelate() {
        const size = 10;
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(this.canvas, 0, 0, w / size, h / size);
        this.ctx.drawImage(this.canvas, 0, 0, w / size, h / size, 0, 0, w, h);
        this.ctx.imageSmoothingEnabled = true;
    }

    applyVignette(intensity) {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.3,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    async handleCapture() {
        if (this.currentMode === 'photo') {
            await this.takePhoto();
        } else if (this.currentMode === 'video') {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                await this.startRecording();
            }
        } else if (this.currentMode === 'timelapse') {
            await this.startTimelapse();
        }
    }

    async takePhoto() {
        if (this.timerSeconds > 0) {
            await this.runTimer();
        }

        // Play shutter sound
        if (this.settings.sound) {
            this.playShutterSound();
        }

        // Flash effect
        this.flashEffect();

        // Capture from canvas (with all effects applied)
        const dataUrl = this.canvas.toDataURL('image/jpeg', this.settings.photoQuality);

        // Save to gallery
        const item = {
            id: Date.now(),
            type: 'photo',
            data: dataUrl,
            timestamp: new Date().toISOString(),
            filter: this.currentFilter,
            mode: this.currentCreativeMode
        };

        this.gallery.unshift(item);
        this.saveGallery();
        this.showToast('Photo capturée !', 'success');
    }

    async startRecording() {
        try {
            // Update UI
            this.isRecording = true;
            document.getElementById('captureBtn').classList.add('recording');
            document.getElementById('recordingIndicator').classList.remove('hidden');

            // Get canvas stream
            const canvasStream = this.canvas.captureStream(30);

            // Add audio if available
            if (this.stream.getAudioTracks().length > 0) {
                const audioTrack = this.stream.getAudioTracks()[0];
                canvasStream.addTrack(audioTrack);
            }

            // Setup recorder
            this.recordedChunks = [];
            this.mediaRecorder = new MediaRecorder(canvasStream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 5000000
            });

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordedChunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);

                const item = {
                    id: Date.now(),
                    type: 'video',
                    data: url,
                    timestamp: new Date().toISOString(),
                    filter: this.currentFilter,
                    mode: this.currentCreativeMode
                };

                this.gallery.unshift(item);
                this.saveGallery();
                this.showToast('Vidéo enregistrée !', 'success');
            };

            // Start recording
            this.mediaRecorder.start();
            this.startRecordingTimer();

        } catch (error) {
            console.error('Recording error:', error);
            this.showToast('Erreur d\'enregistrement', 'error');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            document.getElementById('captureBtn').classList.remove('recording');
            document.getElementById('recordingIndicator').classList.add('hidden');
            this.stopRecordingTimer();
        }
    }

    startRecordingTimer() {
        let seconds = 0;
        this.recordingTimerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            document.getElementById('recordingTime').textContent =
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingTimerInterval) {
            clearInterval(this.recordingTimerInterval);
            this.recordingTimerInterval = null;
        }
    }

    async startTimelapse() {
        this.showToast('Mode Time-lapse activé', 'success');
        // Time-lapse would capture photos at intervals and compile them
        // This is a simplified version
        for (let i = 0; i < 10; i++) {
            await this.takePhoto();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async runTimer() {
        return new Promise(resolve => {
            let count = this.timerSeconds;
            const countdown = document.getElementById('timerCountdown');
            const countdownNumber = countdown.querySelector('.countdown-number');

            countdown.classList.remove('hidden');

            const interval = setInterval(() => {
                countdownNumber.textContent = count;
                countdownNumber.style.animation = 'none';
                setTimeout(() => {
                    countdownNumber.style.animation = 'countdownScale 1s ease-in-out';
                }, 10);

                count--;

                if (count < 0) {
                    clearInterval(interval);
                    countdown.classList.add('hidden');
                    resolve();
                }
            }, 1000);
        });
    }

    playShutterSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjKM0fPTgjMGHm7A7+OZRQ0PVqjn77BdGww9lem6bBwHNYnP9dGANQcZab3w6J5PEA5Uq+fwsGEeDDCJ0vTXfzgGH2u+8Oid');
        audio.play().catch(() => {});
    }

    flashEffect() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: white;
            z-index: 10000;
            animation: flash 0.3s ease-out;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);

        const style = document.createElement('style');
        style.textContent = '@keyframes flash { from { opacity: 1; } to { opacity: 0; } }';
        document.head.appendChild(style);
    }

    async switchCamera() {
        this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';

        // Stop current stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        // Setup new camera
        await this.setupCamera();
        this.showToast('Caméra changée', 'success');
    }

    toggleSidePanel() {
        document.getElementById('sidePanel').classList.toggle('open');
    }

    toggleGrid() {
        document.getElementById('gridOverlay').classList.toggle('hidden');
        document.getElementById('gridBtn').classList.toggle('active');
    }

    toggleHistogram() {
        document.getElementById('histogram').classList.toggle('hidden');
        document.getElementById('histogramBtn').classList.toggle('active');
    }

    toggleFlash() {
        document.getElementById('flashBtn').classList.toggle('active');
        // Flash would be implemented with device flash API if available
        this.showToast('Flash basculé', 'success');
    }

    cycleTimer() {
        const timers = [0, 3, 5, 10];
        const currentIndex = timers.indexOf(this.timerSeconds);
        const nextIndex = (currentIndex + 1) % timers.length;
        this.timerSeconds = timers[nextIndex];

        const btn = document.getElementById('timerBtn');
        if (this.timerSeconds === 0) {
            btn.classList.remove('active');
            this.showToast('Timer désactivé', 'success');
        } else {
            btn.classList.add('active');
            this.showToast(`Timer: ${this.timerSeconds}s`, 'success');
        }
    }

    updateHistogram() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        const histogram = new Array(256).fill(0);

        for (let i = 0; i < data.length; i += 4) {
            const brightness = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
            histogram[brightness]++;
        }

        const max = Math.max(...histogram);
        const hCanvas = document.getElementById('histogramCanvas');
        const hCtx = hCanvas.getContext('2d');

        hCtx.fillStyle = '#000';
        hCtx.fillRect(0, 0, 256, 100);

        hCtx.fillStyle = '#00f3ff';
        for (let i = 0; i < 256; i++) {
            const height = (histogram[i] / max) * 100;
            hCtx.fillRect(i, 100 - height, 1, height);
        }
    }

    showFocusIndicator(x, y) {
        const indicator = document.getElementById('focusIndicator');
        indicator.style.left = `${x}px`;
        indicator.style.top = `${y}px`;
        indicator.classList.add('active');

        setTimeout(() => {
            indicator.classList.remove('active');
        }, 1000);
    }

    openGallery() {
        document.getElementById('galleryModal').classList.remove('hidden');
        this.updateGallery();
    }

    closeGallery() {
        document.getElementById('galleryModal').classList.add('hidden');
    }

    updateGallery() {
        const grid = document.getElementById('galleryGrid');
        grid.innerHTML = '';

        if (this.gallery.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-dim);">Aucune photo ou vidéo</p>';
            return;
        }

        this.gallery.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';

            if (item.type === 'photo') {
                const img = document.createElement('img');
                img.src = item.data;
                img.alt = 'Photo';
                div.appendChild(img);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.data;
                video.controls = false;
                div.appendChild(video);

                const playIcon = document.createElement('div');
                playIcon.className = 'play-icon';
                playIcon.innerHTML = '▶';
                div.appendChild(playIcon);
            }

            div.addEventListener('click', () => this.viewMedia(item));
            grid.appendChild(div);
        });
    }

    viewMedia(item) {
        if (item.type === 'photo') {
            const link = document.createElement('a');
            link.href = item.data;
            link.download = `nexus-photo-${item.id}.jpg`;
            link.click();
        } else if (item.type === 'video') {
            const link = document.createElement('a');
            link.href = item.data;
            link.download = `nexus-video-${item.id}.webm`;
            link.click();
        }
    }

    openSettings() {
        document.getElementById('settingsModal').classList.remove('hidden');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.add('hidden');
    }

    loadSettings() {
        const saved = localStorage.getItem('nexusSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };

            document.getElementById('photoQuality').value = this.settings.photoQuality;
            document.getElementById('videoResolution').value = this.settings.videoResolution;
            document.getElementById('defaultTimer').value = this.settings.defaultTimer;
            document.getElementById('soundToggle').checked = this.settings.sound;
            document.getElementById('metadataToggle').checked = this.settings.metadata;
        }
    }

    saveSettings() {
        localStorage.setItem('nexusSettings', JSON.stringify(this.settings));
    }

    saveGallery() {
        localStorage.setItem('nexusGallery', JSON.stringify(this.gallery));
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NexusCamera();
    });
} else {
    new NexusCamera();
}

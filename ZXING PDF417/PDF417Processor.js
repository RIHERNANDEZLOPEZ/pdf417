// ==================== CLASE PDF417Processor ====================
class PDF417Processor {
    constructor() {
        this.config = {
            grayscale: { enabled: true, method: 'luminance' },
            illuminationCorrection: { enabled: true, strength: 0.7 },
            clahe: { enabled: true, contrast: 1.0 },
            denoising: { enabled: true, strength: 0.5 },
            adaptiveThreshold: {
                enabled: true,
                method: 'sauvola',
                windowSize: 15,
                k: 0.2
            },
            shadowRemoval: { enabled: true, intensity: 0.8 },
            reflectionRemoval: { enabled: true, sensitivity: 0.6 },
            edgeEnhancement: { enabled: true, strength: 0.4 },
            autoROI: {
                enabled: true,
                margin: 15,
                minWidth: 100,
                minHeight: 30,
                confidenceThreshold: 0.7,
                showDebugOverlay: false
            }
        };
        
        this.lastROI = null;
        this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('pdf417_processor_config');
        if (saved) {
            const parsed = JSON.parse(saved);
            for (let key in parsed) {
                if (this.config[key]) {
                    Object.assign(this.config[key], parsed[key]);
                }
            }
        }
    }

    saveSettings() {
        localStorage.setItem('pdf417_processor_config', JSON.stringify(this.config));
    }

    resetSettings() {
        this.config = {
            grayscale: { enabled: true, method: 'luminance' },
            illuminationCorrection: { enabled: true, strength: 0.7 },
            clahe: { enabled: true, contrast: 1.0 },
            denoising: { enabled: true, strength: 0.5 },
            adaptiveThreshold: {
                enabled: true,
                method: 'sauvola',
                windowSize: 15,
                k: 0.2
            },
            shadowRemoval: { enabled: true, intensity: 0.8 },
            reflectionRemoval: { enabled: true, sensitivity: 0.6 },
            edgeEnhancement: { enabled: true, strength: 0.4 },
            autoROI: {
                enabled: true,
                margin: 15,
                minWidth: 100,
                minHeight: 30,
                confidenceThreshold: 0.7,
                showDebugOverlay: false
            }
        };
        this.saveSettings();
    }

    updateFromUI() {
        this.config.grayscale.enabled = document.getElementById('grayscaleEnabled').checked;
        this.config.grayscale.method = document.getElementById('grayscaleMethod').value;
        this.config.illuminationCorrection.enabled = document.getElementById('illuminationEnabled').checked;
        this.config.illuminationCorrection.strength = parseFloat(document.getElementById('illuminationStrength').value);
        this.config.clahe.enabled = document.getElementById('claheEnabled').checked;
        this.config.clahe.contrast = parseFloat(document.getElementById('claheContrast').value);
        this.config.denoising.enabled = document.getElementById('denoisingEnabled').checked;
        this.config.denoising.strength = parseFloat(document.getElementById('denoisingStrength').value);
        this.config.adaptiveThreshold.enabled = document.getElementById('adaptiveThresholdEnabled').checked;
        this.config.adaptiveThreshold.method = document.getElementById('thresholdMethod').value;
        this.config.adaptiveThreshold.windowSize = parseInt(document.getElementById('windowSize').value);
        this.config.adaptiveThreshold.k = parseFloat(document.getElementById('kValue').value);
        this.config.shadowRemoval.enabled = document.getElementById('shadowRemovalEnabled').checked;
        this.config.shadowRemoval.intensity = parseFloat(document.getElementById('shadowIntensity').value);
        this.config.reflectionRemoval.enabled = document.getElementById('reflectionRemovalEnabled').checked;
        this.config.reflectionRemoval.sensitivity = parseFloat(document.getElementById('reflectionSensitivity').value);
        this.config.edgeEnhancement.enabled = document.getElementById('edgeEnhancementEnabled').checked;
        this.config.edgeEnhancement.strength = parseFloat(document.getElementById('edgeStrength').value);
        
        this.config.autoROI.enabled = document.getElementById('autoROIEnabled').checked;
        this.config.autoROI.margin = parseInt(document.getElementById('roiMargin').value);
        this.config.autoROI.confidenceThreshold = parseFloat(document.getElementById('roiConfidence').value) / 100;
        this.config.autoROI.minWidth = parseInt(document.getElementById('roiMinWidth').value);
        this.config.autoROI.minHeight = parseInt(document.getElementById('roiMinHeight').value);
        this.config.autoROI.showDebugOverlay = document.getElementById('roiDebugOverlay').checked;
        
        this.saveSettings();
    }

    updateUIFromConfig() {
        document.getElementById('grayscaleEnabled').checked = this.config.grayscale.enabled;
        document.getElementById('grayscaleMethod').value = this.config.grayscale.method;
        document.getElementById('illuminationEnabled').checked = this.config.illuminationCorrection.enabled;
        document.getElementById('illuminationStrength').value = this.config.illuminationCorrection.strength;
        document.getElementById('illuminationStrengthValue').textContent = this.config.illuminationCorrection.strength;
        document.getElementById('claheEnabled').checked = this.config.clahe.enabled;
        document.getElementById('claheContrast').value = this.config.clahe.contrast;
        document.getElementById('claheContrastValue').textContent = this.config.clahe.contrast;
        document.getElementById('denoisingEnabled').checked = this.config.denoising.enabled;
        document.getElementById('denoisingStrength').value = this.config.denoising.strength;
        document.getElementById('denoisingStrengthValue').textContent = this.config.denoising.strength;
        document.getElementById('adaptiveThresholdEnabled').checked = this.config.adaptiveThreshold.enabled;
        document.getElementById('thresholdMethod').value = this.config.adaptiveThreshold.method;
        document.getElementById('windowSize').value = this.config.adaptiveThreshold.windowSize;
        document.getElementById('windowSizeValue').textContent = this.config.adaptiveThreshold.windowSize;
        document.getElementById('kValue').value = this.config.adaptiveThreshold.k;
        document.getElementById('kValueValue').textContent = this.config.adaptiveThreshold.k.toFixed(2);
        document.getElementById('shadowRemovalEnabled').checked = this.config.shadowRemoval.enabled;
        document.getElementById('shadowIntensity').value = this.config.shadowRemoval.intensity;
        document.getElementById('shadowIntensityValue').textContent = this.config.shadowRemoval.intensity;
        document.getElementById('reflectionRemovalEnabled').checked = this.config.reflectionRemoval.enabled;
        document.getElementById('reflectionSensitivity').value = this.config.reflectionRemoval.sensitivity;
        document.getElementById('reflectionSensitivityValue').textContent = this.config.reflectionRemoval.sensitivity;
        document.getElementById('edgeEnhancementEnabled').checked = this.config.edgeEnhancement.enabled;
        document.getElementById('edgeStrength').value = this.config.edgeEnhancement.strength;
        document.getElementById('edgeStrengthValue').textContent = this.config.edgeEnhancement.strength;
        
        document.getElementById('autoROIEnabled').checked = this.config.autoROI.enabled;
        document.getElementById('roiMargin').value = this.config.autoROI.margin;
        document.getElementById('roiMarginValue').textContent = this.config.autoROI.margin;
        document.getElementById('roiConfidence').value = this.config.autoROI.confidenceThreshold * 100;
        document.getElementById('roiConfidenceValue').textContent = Math.round(this.config.autoROI.confidenceThreshold * 100);
        document.getElementById('roiMinWidth').value = this.config.autoROI.minWidth;
        document.getElementById('roiMinWidthValue').textContent = this.config.autoROI.minWidth;
        document.getElementById('roiMinHeight').value = this.config.autoROI.minHeight;
        document.getElementById('roiMinHeightValue').textContent = this.config.autoROI.minHeight;
        document.getElementById('roiDebugOverlay').checked = this.config.autoROI.showDebugOverlay;
    }

    // ==================== MÉTODOS DE PROCESAMIENTO ====================
    grayscale(imageData, method = 'luminance') {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            let gray;
            switch (method) {
                case 'luminance':
                    gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    break;
                case 'average':
                    gray = (r + g + b) / 3;
                    break;
                case 'lightness':
                    gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
                    break;
                default:
                    gray = 0.299 * r + 0.587 * g + 0.114 * b;
            }
            data[i] = data[i + 1] = data[i + 2] = gray;
        }
        return imageData;
    }

    correctIllumination(imageData, strength) {
        const data = imageData.data;
        const histogram = new Array(256).fill(0);
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i];
            histogram[Math.floor(gray)]++;
        }
        const cdf = new Array(256).fill(0);
        cdf[0] = histogram[0];
        for (let i = 1; i < 256; i++) {
            cdf[i] = cdf[i - 1] + histogram[i];
        }
        const cdfMin = cdf.find(val => val > 0);
        const cdfMax = cdf[255];
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i];
            const cdfValue = cdf[Math.floor(gray)];
            const newGray = ((cdfValue - cdfMin) / (cdfMax - cdfMin)) * 255;
            data[i] = data[i + 1] = data[i + 2] = (1 - strength) * gray + strength * newGray;
        }
        return imageData;
    }

    applyCLAHE(imageData, contrast) {
        const data = imageData.data;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = this.clamp(factor * (r - 128) + 128, 0, 255);
            data[i + 1] = this.clamp(factor * (g - 128) + 128, 0, 255);
            data[i + 2] = this.clamp(factor * (b - 128) + 128, 0, 255);
        }
        return imageData;
    }

    denoise(imageData, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const kernelSize = Math.max(3, Math.floor(strength * 5));
        const halfKernel = Math.floor(kernelSize / 2);
        const tempData = new Uint8ClampedArray(data);

        for (let y = halfKernel; y < height - halfKernel; y++) {
            for (let x = halfKernel; x < width - halfKernel; x++) {
                const idx = (y * width + x) * 4;
                let rValues = [], gValues = [], bValues = [];
                for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                    for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                        const kidx = ((y + ky) * width + (x + kx)) * 4;
                        rValues.push(tempData[kidx]);
                        gValues.push(tempData[kidx + 1]);
                        bValues.push(tempData[kidx + 2]);
                    }
                }
                rValues.sort((a, b) => a - b);
                gValues.sort((a, b) => a - b);
                bValues.sort((a, b) => a - b);
                const medianIndex = Math.floor(rValues.length / 2);
                const blend = strength;
                data[idx] = (1 - blend) * data[idx] + blend * rValues[medianIndex];
                data[idx + 1] = (1 - blend) * data[idx + 1] + blend * gValues[medianIndex];
                data[idx + 2] = (1 - blend) * data[idx + 2] + blend * bValues[medianIndex];
            }
        }
        return imageData;
    }

    sauvolaThreshold(imageData, windowSize, k) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const tempData = new Uint8ClampedArray(data);
        const halfWindow = Math.floor(windowSize / 2);
        const r = 128;

        for (let y = halfWindow; y < height - halfWindow; y++) {
            for (let x = halfWindow; x < width - halfWindow; x++) {
                let sum = 0;
                let sumSq = 0;
                let count = 0;
                for (let wy = -halfWindow; wy <= halfWindow; wy++) {
                    for (let wx = -halfWindow; wx <= halfWindow; wx++) {
                        const idx = ((y + wy) * width + (x + wx)) * 4;
                        const gray = tempData[idx];
                        sum += gray;
                        sumSq += gray * gray;
                        count++;
                    }
                }
                const mean = sum / count;
                const variance = (sumSq / count) - (mean * mean);
                const stdDev = Math.sqrt(variance);
                const threshold = mean * (1 + k * ((stdDev / r) - 1));
                const idx = (y * width + x) * 4;
                const gray = tempData[idx];
                const binary = gray > threshold ? 255 : 0;
                data[idx] = data[idx + 1] = data[idx + 2] = binary;
            }
        }
        return imageData;
    }

    removeShadows(imageData, intensity) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const illumination = new Float32Array(width * height);
        const kernelSize = 31;
        const halfKernel = Math.floor(kernelSize / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sum = 0;
                let count = 0;
                for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                    for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                            const idx = (ny * width + nx) * 4;
                            sum += data[idx];
                            count++;
                        }
                    }
                }
                illumination[y * width + x] = sum / count;
            }
        }

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);
            const illum = illumination[y * width + x];
            const factor = 128 / (illum + 1);
            const gray = data[i];
            if (gray < 128) {
                const corrected = gray * factor * intensity + gray * (1 - intensity);
                data[i] = data[i + 1] = data[i + 2] = this.clamp(corrected, 0, 255);
            }
        }
        return imageData;
    }

    removeReflections(imageData, sensitivity) {
        const data = imageData.data;
        const threshold = 250 - (sensitivity * 50);
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > threshold && g > threshold && b > threshold) {
                const width = imageData.width;
                const height = imageData.height;
                const x = (i / 4) % width;
                const y = Math.floor((i / 4) / width);
                if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
                    let sumR = 0, sumG = 0, sumB = 0, count = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nIdx = ((y + dy) * width + (x + dx)) * 4;
                            sumR += data[nIdx];
                            sumG += data[nIdx + 1];
                            sumB += data[nIdx + 2];
                            count++;
                        }
                    }
                    data[i] = sumR / count;
                    data[i + 1] = sumG / count;
                    data[i + 2] = sumB / count;
                }
            }
        }
        return imageData;
    }

    enhanceEdges(imageData, strength) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const tempData = new Uint8ClampedArray(data);
        const kernel = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];
        const kernelSum = 1;

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let sumR = 0, sumG = 0, sumB = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4;
                        const weight = kernel[ky + 1][kx + 1];
                        sumR += tempData[idx] * weight;
                        sumG += tempData[idx + 1] * weight;
                        sumB += tempData[idx + 2] * weight;
                    }
                }
                const idx = (y * width + x) * 4;
                data[idx] = this.clamp(tempData[idx] + strength * sumR / kernelSum, 0, 255);
                data[idx + 1] = this.clamp(tempData[idx + 1] + strength * sumG / kernelSum, 0, 255);
                data[idx + 2] = this.clamp(tempData[idx + 2] + strength * sumB / kernelSum, 0, 255);
            }
        }
        return imageData;
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    processImage(imageData) {
        let processed = imageData;
        if (this.config.grayscale.enabled) processed = this.grayscale(processed, this.config.grayscale.method);
        if (this.config.illuminationCorrection.enabled) processed = this.correctIllumination(processed, this.config.illuminationCorrection.strength);
        if (this.config.clahe.enabled) processed = this.applyCLAHE(processed, this.config.clahe.contrast);
        if (this.config.denoising.enabled) processed = this.denoise(processed, this.config.denoising.strength);
        if (this.config.shadowRemoval.enabled) processed = this.removeShadows(processed, this.config.shadowRemoval.intensity);
        if (this.config.reflectionRemoval.enabled) processed = this.removeReflections(processed, this.config.reflectionRemoval.sensitivity);
        if (this.config.edgeEnhancement.enabled) processed = this.enhanceEdges(processed, this.config.edgeEnhancement.strength);
        if (this.config.adaptiveThreshold.enabled) processed = this.sauvolaThreshold(processed, this.config.adaptiveThreshold.windowSize, this.config.adaptiveThreshold.k);
        return processed;
    }

    // ==================== FUNCIONES DE ROI ====================
    async processImageWithROI(imageElement) {
        try {
            if (this.config.autoROI.enabled) {
                const roi = await this.detectPDF417ROI(imageElement);
                if (roi && roi.confidence > this.config.autoROI.confidenceThreshold) {
                    this.lastROI = roi;
                    const croppedCanvas = this.cropToROI(imageElement, roi);
                    const ctx = croppedCanvas.getContext('2d');
                    let imageData = ctx.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);
                    imageData = this.processImage(imageData);
                    ctx.putImageData(imageData, 0, 0);
                    return { canvas: croppedCanvas, roi: roi, cropped: true };
                }
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = imageElement.width || imageElement.videoWidth;
            canvas.height = imageElement.height || imageElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            imageData = this.processImage(imageData);
            ctx.putImageData(imageData, 0, 0);
            return { canvas: canvas, roi: null, cropped: false };
            
        } catch (error) {
            console.error("Error en procesamiento con ROI:", error);
            const canvas = document.createElement('canvas');
            canvas.width = imageElement.width || imageElement.videoWidth;
            canvas.height = imageElement.height || imageElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            imageData = this.processImage(imageData);
            ctx.putImageData(imageData, 0, 0);
            return { canvas: canvas, roi: null, cropped: false };
        }
    }

    cropToROI(imageElement, roi) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const x = Math.round(roi.x);
        const y = Math.round(roi.y);
        const width = Math.round(roi.width);
        const height = Math.round(roi.height);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(imageElement, x, y, width, height, 0, 0, width, height);
        return canvas;
    }

    async detectPDF417ROI(imageElement) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const scale = 0.5;
            const width = imageElement.width || imageElement.videoWidth;
            const height = imageElement.height || imageElement.videoHeight;
            canvas.width = width * scale;
            canvas.height = height * scale;
            ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let minX = canvas.width, maxX = 0;
            let minY = canvas.height, maxY = 0;
            let found = false;
            
            for (let y = 0; y < canvas.height; y += 2) {
                for (let x = 0; x < canvas.width; x += 2) {
                    const idx = (y * canvas.width + x) * 4;
                    const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                    if (brightness < 100) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                        found = true;
                    }
                }
            }
            
            if (!found || (maxX - minX) < 10 || (maxY - minY) < 10) {
                resolve(null);
                return;
            }
            
            const roi = {
                x: Math.max(0, (minX / scale) - this.config.autoROI.margin),
                y: Math.max(0, (minY / scale) - this.config.autoROI.margin),
                width: Math.min(width, ((maxX - minX) / scale) + (this.config.autoROI.margin * 2)),
                height: Math.min(height, ((maxY - minY) / scale) + (this.config.autoROI.margin * 2)),
                confidence: 0.8
            };
            
            resolve(roi);
        });
    }
}
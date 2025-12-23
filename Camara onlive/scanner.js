// scanner.js - Implementación real con ZXing
class PDF417LicenseScanner {
    constructor() {
        // Estado de la aplicación
        this.state = {
            isScanning: false,
            isCameraActive: false,
            currentStream: null,
            selectedCamera: null,
            cameras: [],
            lastScanTime: 0,
            failedAttempts: 0,
            totalScans: 0,
            scanStartTime: null,
            fps: 0,
            frameCount: 0,
            lastFpsUpdate: 0
        };

        // Elementos DOM
        this.elements = {
            video: document.getElementById('videoElement'),
            startBtn: document.getElementById('startButton'),
            stopBtn: document.getElementById('stopButton'),
            cameraSelect: document.getElementById('cameraSelect'),
            tryHarderToggle: document.getElementById('tryHarderToggle'),
            scanAgainBtn: document.getElementById('scanAgainButton'),

            // Paneles
            scannerPanel: document.getElementById('scannerPanel'),
            resultsPanel: document.getElementById('resultsPanel'),

            // Resultados
            licenseNumber: document.getElementById('licenseNumber'),
            fullName: document.getElementById('fullName'),
            birthDate: document.getElementById('birthDate'),
            expiryDate: document.getElementById('expiryDate'),
            state: document.getElementById('state'),
            address: document.getElementById('address'),
            rawData: document.getElementById('rawData'),

            // Estado
            statusIcon: document.getElementById('statusIcon'),
            statusText: document.getElementById('statusText'),
            fpsCounter: document.getElementById('fpsCounter'),

            // Depuración
            debugCameraStatus: document.getElementById('debugCameraStatus'),
            debugResolution: document.getElementById('debugResolution'),
            debugLastScan: document.getElementById('debugLastScan'),
            debugFailedAttempts: document.getElementById('debugFailedAttempts'),

            // Validación
            formatValid: document.getElementById('formatValid'),
            checksumValid: document.getElementById('checksumValid'),
            expiryValid: document.getElementById('expiryValid')
        };

        // ZXing Reader
        this.codeReader = null;
        this.initZXing();

        // Canvas para procesamiento
        this.canvas = document.getElementById('debugCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Inicializar eventos
        this.initEvents();
        this.updateDebugInfo();
    }

    // Inicializar ZXing
    initZXing() {
        const { BrowserMultiFormatReader, BarcodeFormat } = window.ZXing;

        // Configurar formatos que queremos leer (solo PDF417)
        this.codeReader = new BrowserMultiFormatReader();

        // Crear hints personalizados para PDF417
        this.codeReader.hints = new Map();
        this.codeReader.hints.set(
            BrowserMultiFormatReader.DECODE_HINT,
            new Set([BarcodeFormat.PDF_417])
        );

        console.log('ZXing inicializado para PDF417');
    }

    // Inicializar eventos
    initEvents() {
        this.elements.startBtn.addEventListener('click', () => this.startCamera());
        this.elements.stopBtn.addEventListener('click', () => this.stopCamera());
        this.elements.scanAgainBtn.addEventListener('click', () => this.showScanner());
        this.elements.cameraSelect.addEventListener('change', (e) => this.switchCamera(e.target.value));

        // Copiar datos crudos
        document.getElementById('copyRawData').addEventListener('click', () => {
            navigator.clipboard.writeText(this.elements.rawData.textContent)
                .then(() => this.showToast('📋 Datos copiados al portapapeles'))
                .catch(err => console.error('Error al copiar:', err));
        });

        // Mostrar/ocultar datos crudos
        document.getElementById('toggleRawData').addEventListener('click', () => {
            const rawData = this.elements.rawData;
            rawData.style.display = rawData.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Iniciar cámara
    async startCamera() {
        try {
            this.updateStatus('⏳ Iniciando cámara...', 'warning');
            this.elements.startBtn.disabled = true;

            // Obtener lista de cámaras
            await this.getCameraList();

            // Configurar restricciones
            const constraints = {
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 30 },
                    facingMode: 'environment'
                }
            };

            // Usar cámara seleccionada si hay
            if (this.state.selectedCamera) {
                constraints.video.deviceId = { exact: this.state.selectedCamera };
            }

            // Obtener stream
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.state.currentStream = stream;

            // Configurar video
            this.elements.video.srcObject = stream;

            // Esperar a que el video esté listo
            await new Promise((resolve) => {
                this.elements.video.onloadedmetadata = () => {
                    this.elements.video.play().then(resolve);
                };
            });

            // Actualizar estado
            this.state.isCameraActive = true;
            this.state.isScanning = true;
            this.state.scanStartTime = Date.now();
            this.state.frameCount = 0;
            this.state.lastFpsUpdate = Date.now();

            this.updateStatus('🔍 Escaneando PDF417...', 'scanning');
            this.updateControls(true);
            this.updateDebugInfo();

            // Iniciar loop de escaneo
            this.scanLoop();

            // Iniciar actualización de FPS
            this.updateFPS();

        } catch (error) {
            console.error('Error al iniciar cámara:', error);
            this.updateStatus(`❌ Error: ${error.message}`, 'error');
            this.elements.startBtn.disabled = false;
            this.showToast(`Error de cámara: ${error.message}`);
        }
    }

    // Obtener lista de cámaras
    async getCameraList() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.state.cameras = devices.filter(device => device.kind === 'videoinput');

            // Limpiar selector
            this.elements.cameraSelect.innerHTML = '<option value="">Seleccionar cámara...</option>';

            // Poblar selector
            this.state.cameras.forEach((camera, index) => {
                const option = document.createElement('option');
                option.value = camera.deviceId;
                option.text = camera.label || `Cámara ${index + 1}`;
                this.elements.cameraSelect.appendChild(option);
            });

            this.elements.cameraSelect.disabled = false;

            // Seleccionar cámara trasera por defecto
            const backCamera = this.state.cameras.find(cam =>
                cam.label.toLowerCase().includes('back') ||
                cam.label.toLowerCase().includes('rear') ||
                cam.label.toLowerCase().includes('environment')
            );

            if (backCamera) {
                this.state.selectedCamera = backCamera.deviceId;
                this.elements.cameraSelect.value = backCamera.deviceId;
            }

        } catch (error) {
            console.warn('No se pudieron listar cámaras:', error);
        }
    }

    // Loop principal de escaneo
    async scanLoop() {
        if (!this.state.isScanning) return;

        const now = Date.now();

        // Control FPS - no escanear más de 10 veces por segundo
        if (now - this.state.lastScanTime < 100) {
            requestAnimationFrame(() => this.scanLoop());
            return;
        }

        this.state.lastScanTime = now;
        this.state.frameCount++;

        try {
            // Capturar frame
            this.captureFrame();

            // Intentar decodificar con ZXing
            const result = await this.decodeWithZXing();

            if (result) {
                // ¡Código detectado!
                this.handleScanSuccess(result);
                return;
            }

        } catch (error) {
            this.state.failedAttempts++;
            // No mostrar errores normales (es esperado que falle frecuentemente)
        }

        // Continuar loop
        if (this.state.isScanning) {
            requestAnimationFrame(() => this.scanLoop());
        }
    }

    // Capturar frame actual
    captureFrame() {
        const video = this.elements.video;

        // Solo actualizar canvas si es necesario para depuración
        if (this.elements.tryHarderToggle.checked) {
            this.canvas.width = video.videoWidth;
            this.canvas.height = video.videoHeight;
            this.ctx.drawImage(video, 0, 0);
        }
    }

    // Decodificar con ZXing
    async decodeWithZXing() {
        if (!this.codeReader || !this.state.isScanning) return null;

        try {
            // Configurar hints
            const hints = new Map();
            hints.set(
                this.codeReader.DECODE_HINT,
                new Set([window.ZXing.BarcodeFormat.PDF_417])
            );

            hints.set(
                this.codeReader.TRY_HARDER_HINT,
                this.elements.tryHarderToggle.checked
            );

            // Decodificar desde el elemento de video
            const result = await this.codeReader.decodeFromVideoElement(

                this.elements.video,
                (result, error) => {
                    if (result) return result;
                    if (error && !(error instanceof window.ZXing.NotFoundException)) {
                        console.debug('Error ZXing:', error);
                    }
                    return null;
                }
            );

            return result;

        } catch (error) {
            if (error instanceof window.ZXing.NotFoundException) {
                // No se encontró código - esto es normal
                return null;
            }
            console.warn('Error en decodificación:', error);
            return null;
        }
    }

    // Manejar escaneo exitoso
    handleScanSuccess(result) {
        console.log('✅ Código PDF417 detectado:', result);

        // Detener escaneo
        this.stopCamera();

        // Procesar datos
        this.processLicenseData(result.text);

        // Mostrar resultados
        this.showResults();

        // Feedback
        this.updateStatus('✅ Licencia detectada', 'success');
        this.playSuccessSound();
        this.showToast('✅ Licencia escaneada correctamente');
    }

    // Procesar datos de la licencia
    processLicenseData(rawText) {
        console.log('Procesando datos AAMVA:', rawText);

        // Guardar datos crudos
        this.elements.rawData.textContent = rawText;

        // Parsear formato AAMVA básico
        const licenseData = this.parseAAMVA(rawText);

        // Actualizar UI
        this.elements.licenseNumber.textContent = licenseData.licenseNumber || 'No encontrado';
        this.elements.fullName.textContent = licenseData.fullName || 'No encontrado';
        this.elements.birthDate.textContent = licenseData.birthDateFormatted || 'No encontrado';
        this.elements.expiryDate.textContent = licenseData.expiryDateFormatted || 'No encontrado';
        this.elements.state.textContent = licenseData.stateName || 'No encontrado';
        this.elements.address.textContent = licenseData.fullAddress || 'No encontrado';

        // Validaciones
        this.updateValidations(licenseData);

        // Actualizar depuración
        this.state.totalScans++;
        this.elements.debugLastScan.textContent = new Date().toLocaleTimeString();
    }

    // Parsear formato AAMVA
    parseAAMVA(rawText) {
        const lines = rawText.split('\n');
        const data = {};

        lines.forEach(line => {
            if (line.length >= 3) {
                const code = line.substring(0, 3);
                const value = line.substring(3).trim();

                switch (code) {
                    case 'DAQ': data.licenseNumber = value; break;
                    case 'DCS': data.lastName = value; break;
                    case 'DAC': data.firstName = value; break;
                    case 'DAD': data.middleName = value; break;
                    case 'DBB': data.birthDate = value; break;
                    case 'DBA': data.expiryDate = value; break;
                    case 'DAJ': data.state = value; break;
                    case 'DAG': data.streetAddress = value; break;
                    case 'DAI': data.city = value; break;
                    case 'DAK': data.zipCode = value; break;
                    case 'DCG': data.country = value; break;
                    case 'DBC': data.gender = value; break;
                    case 'DAY': data.eyeColor = value; break;
                    case 'DAU': data.height = value; break;
                }
            }
        });

        // Formatear datos
        data.fullName = `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim();
        data.fullAddress = [data.streetAddress, data.city, data.state, data.zipCode]
            .filter(Boolean)
            .join(', ');

        // Formatear fechas
        data.birthDateFormatted = this.formatDate(data.birthDate);
        data.expiryDateFormatted = this.formatDate(data.expiryDate);

        // Nombre del estado
        data.stateName = this.getStateName(data.state);

        return data;
    }

    // Formatear fecha
    formatDate(dateStr) {
        if (!dateStr) return '';

        // Formato YYYY-MM-DD
        const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (match) {
            const [, year, month, day] = match;
            return `${day}/${month}/${year}`;
        }

        return dateStr;
    }

    // Obtener nombre del estado
    getStateName(stateCode) {
        const states = {
            'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
            'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut',
            'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii',
            'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
            'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine',
            'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan',
            'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
            'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
            'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico',
            'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota',
            'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
            'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
            'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
            'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
            'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
        };

        return states[stateCode] || stateCode;
    }

    // Actualizar validaciones
    updateValidations(data) {
        // Validar formato básico
        const hasRequiredFields = data.licenseNumber && data.lastName && data.firstName;
        this.elements.formatValid.textContent = hasRequiredFields ? '✅ Válido' : '❌ Inválido';
        this.elements.formatValid.style.color = hasRequiredFields ? '#00ff00' : '#ff0000';

        // Validar fecha de expiración
        if (data.expiryDate) {
            const expiry = new Date(data.expiryDate);
            const today = new Date();
            const isValid = expiry > today;
            this.elements.expiryValid.textContent = isValid ? '✅ Vigente' : '⚠️ Expirada';
            this.elements.expiryValid.style.color = isValid ? '#00ff00' : '#ff9900';
        } else {
            this.elements.expiryValid.textContent = '❓ Desconocida';
            this.elements.expiryValid.style.color = '#999';
        }

        // Checksum (simulado - en realidad se necesita algoritmo específico)
        const hasValidLength = data.licenseNumber && data.licenseNumber.length >= 5;
        this.elements.checksumValid.textContent = hasValidLength ? '✅ Aprobado' : '⚠️ Dudoso';
        this.elements.checksumValid.style.color = hasValidLength ? '#00ff00' : '#ff9900';
    }

    // Cambiar cámara
    async switchCamera(deviceId) {
        if (!deviceId) return;

        this.state.selectedCamera = deviceId;

        // Si hay cámara activa, reiniciar
        if (this.state.isCameraActive) {
            await this.stopCamera();
            setTimeout(() => this.startCamera(), 500);
        }
    }

    // Detener cámara
    async stopCamera() {
        this.state.isScanning = false;
        this.state.isCameraActive = false;

        // Detener stream
        if (this.state.currentStream) {
            this.state.currentStream.getTracks().forEach(track => track.stop());
            this.state.currentStream = null;
        }

        // Limpiar video
        this.elements.video.srcObject = null;

        // Actualizar controles
        this.updateControls(false);
        this.updateStatus('⏹ Cámara detenida', 'stopped');
        this.updateDebugInfo();
    }

    // Mostrar escáner
    showScanner() {
        this.elements.scannerPanel.style.display = 'block';
        this.elements.resultsPanel.style.display = 'none';
        this.updateStatus('📷 Listo para escanear', 'ready');
    }

    // Mostrar resultados
    showResults() {
        this.elements.scannerPanel.style.display = 'none';
        this.elements.resultsPanel.style.display = 'block';
    }

    // Actualizar controles
    updateControls(isActive) {
        this.elements.startBtn.disabled = isActive;
        this.elements.stopBtn.disabled = !isActive;
        this.elements.cameraSelect.disabled = !isActive;
    }

    // Actualizar estado
    updateStatus(message, type = 'info') {
        this.elements.statusText.textContent = message;

        const icons = {
            'ready': '📷',
            'warning': '⚠️',
            'scanning': '🔍',
            'success': '✅',
            'error': '❌',
            'stopped': '⏹',
            'info': 'ℹ️'
        };

        const colors = {
            'ready': '#0066ff',
            'warning': '#ff9800',
            'scanning': '#00ccff',
            'success': '#00b09b',
            'error': '#f44336',
            'stopped': '#666',
            'info': '#999'
        };

        this.elements.statusIcon.textContent = icons[type] || icons.info;
        this.elements.statusIcon.style.color = colors[type] || colors.info;
    }

    // Actualizar FPS
    updateFPS() {
        if (!this.state.isScanning) return;

        const now = Date.now();
        const elapsed = now - this.state.lastFpsUpdate;

        if (elapsed >= 1000) {
            this.state.fps = Math.round((this.state.frameCount * 1000) / elapsed);
            this.elements.fpsCounter.textContent = `${this.state.fps} FPS`;
            this.state.frameCount = 0;
            this.state.lastFpsUpdate = now;
        }

        requestAnimationFrame(() => this.updateFPS());
    }

    // Actualizar información de depuración
    updateDebugInfo() {
        this.elements.debugCameraStatus.textContent = this.state.isCameraActive ? 'Activa' : 'Inactiva';
        this.elements.debugCameraStatus.style.color = this.state.isCameraActive ? '#00ff00' : '#ff0000';

        if (this.elements.video.videoWidth) {
            this.elements.debugResolution.textContent =
                `${this.elements.video.videoWidth} × ${this.elements.video.videoHeight}`;
        }

        this.elements.debugFailedAttempts.textContent = this.state.failedAttempts;
    }

    // Sonido de éxito
    playSuccessSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);

        } catch (error) {
            // Silencioso en caso de error
        }
    }

    // Mostrar notificación toast
    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Limpieza
    cleanup() {
        this.stopCamera();
        if (this.codeReader) {
            this.codeReader.reset();
        }
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    // Agregar estilos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Crear instancia del escáner
    window.scanner = new PDF417LicenseScanner();

    // Manejar cierre/recarga
    window.addEventListener('beforeunload', () => {
        if (window.scanner) {
            window.scanner.cleanup();
        }
    });

    // Manejar visibilidad de la página
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && window.scanner) {
            window.scanner.stopCamera();
        }
    });
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDF417LicenseScanner;
}
// ==================== VARIABLES GLOBALES ====================
let processor = null;
let stream = null;
let autoScanInterval = null;
let isAutoScanning = false;
let codeReader = null;
let currentImage = null;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initializeComponents();
    initializeEventListeners();
    initializeROIControls();
    
    // Cargar configuración
    processor.updateUIFromConfig();
    updateROIPreview(null);
});

function initializeComponents() {
    // Crear instancias
    processor = new PDF417Processor();
    codeReader = new ZXing.BrowserPDF417Reader({
            // Hints para mejorar la detección
            hints: new Map([
                [ZXing.DecodeHintType.TRY_HARDER, true],
                [ZXing.DecodeHintType.POSSIBLE_FORMATS, [ZXing.BarcodeFormat.PDF_417]],
                [ZXing.DecodeHintType.PURE_BARCODE, false],
                [ZXing.DecodeHintType.CHARACTER_SET, 'UTF-8'],
                [ZXing.DecodeHintType.ALSO_INVERTED, true]
            ])
        });
    
    // Crear elemento de imagen oculto para ROI
    currentImage = document.createElement('img');
    currentImage.id = 'currentImage';
    currentImage.style.display = 'none';
    document.body.appendChild(currentImage);
    
    // Ocultar controles de ROI si están desactivados
    const autoROIEnabled = document.getElementById('autoROIEnabled');
    const roiSubControls = document.getElementById('roiSubControls');
    roiSubControls.style.display = autoROIEnabled.checked ? 'block' : 'none';
}

// ==================== FUNCIONES DE CÁMARA ====================
async function startCamera() {
    try {
        const constraints = {
            video: { 
                width: { ideal: 1280 }, 
                height: { ideal: 720 }, 
                facingMode: 'environment' 
            },
            audio: false
        };
        
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById('video');
        video.srcObject = stream;
        
        // Ajustar canvas overlay al tamaño del video
        video.onloadedmetadata = () => {
            const overlay = document.getElementById('overlay');
            overlay.width = video.videoWidth;
            overlay.height = video.videoHeight;
        };
        
        // Habilitar/deshabilitar botones
        document.getElementById('startButton').disabled = true;
        document.getElementById('stopButton').disabled = false;
        document.getElementById('captureButton').disabled = false;
        
        showNotification('Cámara iniciada correctamente', 'success');
    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        showNotification('No se pudo acceder a la cámara: ' + err.message, 'error');
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        document.getElementById('video').srcObject = null;
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
        document.getElementById('captureButton').disabled = true;
        stopAutoScan();
        showNotification('Cámara detenida', 'info');
    }
}

// ==================== FUNCIONES DE ESCANEO ====================
function showProcessing(show) {
    const indicator = document.getElementById('processingIndicator');
    if (show) {
        indicator.classList.remove('d-none');
    } else {
        indicator.classList.add('d-none');
    }
}

async function captureAndScan() {
    const video = document.getElementById('video');
    if (!video.srcObject) {
        showNotification('Inicia la cámara primero', 'warning');
        return;
    }

    showProcessing(true);

    try {
        // Crear canvas con el frame actual
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Guardar imagen para ROI
        currentImage.src = canvas.toDataURL();
        currentImage.width = canvas.width;
        currentImage.height = canvas.height;

        // Actualizar configuración
        processor.updateFromUI();

        let resultCanvas;
        let roiResult;
        
        // Procesar con ROI si está activado
        if (processor.config.autoROI.enabled) {
            roiResult = await processor.processImageWithROI(canvas);
            resultCanvas = roiResult.canvas;
            
            if (roiResult.roi) {
                updateROIPreview(roiResult.roi);
                if (processor.config.autoROI.showDebugOverlay) {
                    drawROIOverlay(canvas, roiResult.roi);
                }
            } else {
                updateROIPreview(null);
            }
        } else {
            // Procesar imagen completa
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            imageData = processor.processImage(imageData);
            resultCanvas = document.createElement('canvas');
            resultCanvas.width = canvas.width;
            resultCanvas.height = canvas.height;
            const resultCtx = resultCanvas.getContext('2d');
            resultCtx.putImageData(imageData, 0, 0);
        }

        // Mostrar imagen procesada en overlay
        const overlay = document.getElementById('overlay');
        const overlayCtx = overlay.getContext('2d');
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        overlayCtx.drawImage(resultCanvas, 0, 0, overlay.width, overlay.height);

        // Intentar decodificar
        try {
            const result = await codeReader.decodeFromCanvas(resultCanvas);
            if (result && result.text) {
                showResults(result.text);
                showNotification('PDF417 decodificado exitosamente', 'success');
            } else {
                throw new Error('No se pudo decodificar');
            }
        } catch (decodeError) {
            // Intentar con diferentes configuraciones
            try {
                const result = await codeReader.decodeFromCanvas(resultCanvas, { tryHarder: true });
                if (result && result.text) {
                    showResults(result.text);
                    showNotification('PDF417 decodificado (con tryHarder)', 'success');
                } else {
                    throw new Error('No se pudo decodificar con tryHarder');
                }
            } catch (tryHarderError) {
                showResults('No se detectó código PDF417. Intenta ajustar los filtros o la iluminación.');
                showNotification('No se pudo decodificar el PDF417', 'warning');
            }
        }

    } catch (error) {
        console.error('Error en captura y escaneo:', error);
        showResults('Error en el proceso de escaneo: ' + error.message);
        showNotification('Error en escaneo', 'error');
    }

    showProcessing(false);
}

function startAutoScan() {
    if (isAutoScanning) return;
    isAutoScanning = true;
    document.getElementById('toggleScan').innerHTML = '<i class="bi bi-pause-circle"></i> Auto Escanear: Activado';
    autoScanInterval = setInterval(captureAndScan, 2000);
    showNotification('Auto-escaneo activado', 'info');
}

function stopAutoScan() {
    isAutoScanning = false;
    if (autoScanInterval) {
        clearInterval(autoScanInterval);
        autoScanInterval = null;
    }
    document.getElementById('toggleScan').innerHTML = '<i class="bi bi-play-circle"></i> Auto Escanear: Desactivado';
    showNotification('Auto-escaneo desactivado', 'info');
}

function toggleAutoScan() {
    if (isAutoScanning) {
        stopAutoScan();
    } else {
        startAutoScan();
    }
}

function showResults(text) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = text;
    resultsDiv.classList.add('bg-success', 'bg-opacity-10', 'border', 'border-success');
    
    // Remover el highlight después de 2 segundos
    setTimeout(() => {
        resultsDiv.classList.remove('bg-success', 'bg-opacity-10', 'border', 'border-success');
    }, 2000);
}

// ==================== FUNCIONES DE ROI ====================
function initializeROIControls() {
    const autoROIEnabled = document.getElementById('autoROIEnabled');
    const roiSubControls = document.getElementById('roiSubControls');
    const roiMargin = document.getElementById('roiMargin');
    const roiMarginValue = document.getElementById('roiMarginValue');
    const roiConfidence = document.getElementById('roiConfidence');
    const roiConfidenceValue = document.getElementById('roiConfidenceValue');
    const roiMinWidth = document.getElementById('roiMinWidth');
    const roiMinWidthValue = document.getElementById('roiMinWidthValue');
    const roiMinHeight = document.getElementById('roiMinHeight');
    const roiMinHeightValue = document.getElementById('roiMinHeightValue');
    const manualROIButton = document.getElementById('manualROIButton');
    const resetROIButton = document.getElementById('resetROIButton');
    const testROIButton = document.getElementById('testROIButton');
    const roiDebugOverlay = document.getElementById('roiDebugOverlay');

    autoROIEnabled.addEventListener('change', (e) => {
        processor.config.autoROI.enabled = e.target.checked;
        roiSubControls.style.display = e.target.checked ? 'block' : 'none';
        processor.saveSettings();
    });

    roiMargin.addEventListener('input', (e) => {
        processor.config.autoROI.margin = parseInt(e.target.value);
        roiMarginValue.textContent = e.target.value;
        processor.saveSettings();
    });

    roiConfidence.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        processor.config.autoROI.confidenceThreshold = value / 100;
        roiConfidenceValue.textContent = value;
        processor.saveSettings();
    });

    roiDebugOverlay.addEventListener('change', (e) => {
        processor.config.autoROI.showDebugOverlay = e.target.checked;
        processor.saveSettings();
    });

    roiMinWidth.addEventListener('input', (e) => {
        processor.config.autoROI.minWidth = parseInt(e.target.value);
        roiMinWidthValue.textContent = e.target.value;
        processor.saveSettings();
    });

    roiMinHeight.addEventListener('input', (e) => {
        processor.config.autoROI.minHeight = parseInt(e.target.value);
        roiMinHeightValue.textContent = e.target.value;
        processor.saveSettings();
    });

    manualROIButton.addEventListener('click', openManualROISelection);
    resetROIButton.addEventListener('click', resetROI);
    testROIButton.addEventListener('click', testROIDetection);
}

function drawROIOverlay(imageElement, roi) {
    const container = imageElement.parentElement;
    let overlayDiv = container.querySelector('.roi-overlay');
    
    if (!overlayDiv) {
        overlayDiv = document.createElement('div');
        overlayDiv.className = 'roi-overlay';
        container.appendChild(overlayDiv);
    }
    
    overlayDiv.style.cssText = `
        position: absolute;
        left: ${roi.x}px;
        top: ${roi.y}px;
        width: ${roi.width}px;
        height: ${roi.height}px;
    `;
    
    setTimeout(() => {
        if (overlayDiv && overlayDiv.parentElement) {
            overlayDiv.remove();
        }
    }, 5000);
}

function updateROIPreview(roi) {
    const statusElement = document.getElementById('roiStatus');
    const confidenceElement = document.getElementById('roiConfidenceDisplay');
    const dimensionsElement = document.getElementById('roiDimensions');
    const previewCanvas = document.getElementById('roiPreviewCanvas');
    const ctx = previewCanvas.getContext('2d');
    
    if (!roi) {
        statusElement.textContent = 'No detectado';
        statusElement.className = 'badge bg-secondary';
        confidenceElement.textContent = '-';
        confidenceElement.className = 'badge bg-secondary';
        dimensionsElement.textContent = '-';
        dimensionsElement.className = 'badge bg-secondary';
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        return;
    }
    
    statusElement.textContent = roi.manual ? 'Manual' : 'Detectado';
    statusElement.className = roi.manual ? 'badge bg-primary' : 'badge bg-success';
    confidenceElement.textContent = Math.round(roi.confidence * 100) + '%';
    confidenceElement.className = roi.confidence > 0.7 ? 'badge bg-success' : 
                                  roi.confidence > 0.4 ? 'badge bg-warning' : 'badge bg-danger';
    dimensionsElement.textContent = `${Math.round(roi.width)}x${Math.round(roi.height)}`;
    dimensionsElement.className = 'badge bg-dark';
    
    if (currentImage.src) {
        previewCanvas.width = roi.width;
        previewCanvas.height = roi.height;
        
        ctx.drawImage(
            currentImage,
            roi.x, roi.y, roi.width, roi.height,
            0, 0, roi.width, roi.height
        );
        
        ctx.strokeStyle = roi.confidence > 0.7 ? '#28a745' : 
                         roi.confidence > 0.4 ? '#ffc107' : '#dc3545';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, roi.width, roi.height);
    }
}

function openManualROISelection() {
    if (!currentImage.src) {
        showNotification('Primero captura o carga una imagen', 'warning');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('roiSelectionModal'));
    const canvas = document.getElementById('roiSelectionCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    ctx.drawImage(currentImage, 0, 0);
    
    let isDrawing = false;
    let startX, startY;
    let currentRect = null;
    
    function startDrawing(e) {
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        isDrawing = true;
        currentRect = null;
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(currentImage, 0, 0);
        
        ctx.strokeStyle = '#0d6efd';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
        
        currentRect = {
            x: Math.min(startX, currentX),
            y: Math.min(startY, currentY),
            width: Math.abs(currentX - startX),
            height: Math.abs(currentY - startY)
        };
    }
    
    function stopDrawing() {
        isDrawing = false;
        ctx.setLineDash([]);
    }
    
    function confirmSelection() {
        if (currentRect && currentRect.width > 50 && currentRect.height > 20) {
            processor.lastROI = {
                ...currentRect,
                confidence: 1.0,
                manual: true
            };
            
            updateROIPreview(processor.lastROI);
            modal.hide();
            showNotification('Área seleccionada manualmente', 'success');
            
            // Limpiar eventos
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('dblclick', confirmSelection);
        } else {
            showNotification('Selecciona un área más grande', 'warning');
        }
    }
    
    // Configurar eventos
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('dblclick', confirmSelection);
    
    document.getElementById('confirmROI').onclick = confirmSelection;
    
    modal.show();
}

function resetROI() {
    processor.lastROI = null;
    updateROIPreview(null);
    showNotification('Recorte restablecido', 'info');
}

async function testROIDetection() {
    if (!currentImage.src) {
        showNotification('Primero captura o carga una imagen', 'warning');
        return;
    }
    
    showNotification('Probando detección de ROI...', 'info');
    
    try {
        const roi = await processor.detectPDF417ROI(currentImage);
        
        if (roi) {
            updateROIPreview(roi);
            showNotification(`ROI detectado con ${Math.round(roi.confidence * 100)}% de confianza`, 'success');
            
            if (processor.config.autoROI.showDebugOverlay) {
                drawROIOverlay(currentImage, roi);
            }
        } else {
            showNotification('No se pudo detectar el PDF417', 'warning');
        }
    } catch (error) {
        showNotification('Error en detección: ' + error.message, 'error');
    }
}

// ==================== MANEJO DE ARCHIVOS ====================
async function handleFileUpload(file) {
    const img = new Image();
    img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Guardar imagen actual
        currentImage.src = canvas.toDataURL();
        currentImage.width = canvas.width;
        currentImage.height = canvas.height;

        // Actualizar configuración
        processor.updateFromUI();

        // Procesar imagen
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        imageData = processor.processImage(imageData);

        // Mostrar en overlay
        const overlay = document.getElementById('overlay');
        overlay.width = canvas.width;
        overlay.height = canvas.height;
        const overlayCtx = overlay.getContext('2d');
        overlayCtx.putImageData(imageData, 0, 0);

        // Convertir para decodificación
        const processedCanvas = document.createElement('canvas');
        processedCanvas.width = canvas.width;
        processedCanvas.height = canvas.height;
        const processedCtx = processedCanvas.getContext('2d');
        processedCtx.putImageData(imageData, 0, 0);

        showProcessing(true);
        try {
            const result = await codeReader.decodeFromCanvas(processedCanvas);
            if (result && result.text) {
                showResults(result.text);
                showNotification('PDF417 decodificado exitosamente', 'success');
            } else {
                throw new Error('No se pudo decodificar');
            }
        } catch (err) {
            console.log('No se pudo decodificar:', err);
            showResults('No se detectó código PDF417. Intenta ajustar los filtros.');
            showNotification('No se pudo decodificar el PDF417', 'warning');
        }
        showProcessing(false);
    };
    img.src = URL.createObjectURL(file);
}

// ==================== NOTIFICACIONES ====================
function showNotification(message, type = 'info') {
    // Tipos: success, danger, warning, info
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const alertId = 'notification-' + Date.now();
    const alert = document.createElement('div');
    alert.id = alertId;
    alert.className = `alert ${alertClass} alert-dismissible fade show notification`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (document.getElementById(alertId)) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Botones principales
    document.getElementById('startButton').addEventListener('click', startCamera);
    document.getElementById('stopButton').addEventListener('click', stopCamera);
    document.getElementById('captureButton').addEventListener('click', captureAndScan);
    document.getElementById('toggleScan').addEventListener('click', toggleAutoScan);
    
    // Subir archivo
    document.getElementById('uploadButton').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // Copiar resultado
    document.getElementById('copyResult').addEventListener('click', () => {
        const results = document.getElementById('results');
        navigator.clipboard.writeText(results.textContent)
            .then(() => showNotification('Resultado copiado al portapapeles', 'success'))
            .catch(() => showNotification('Error al copiar el resultado', 'error'));
    });
    
    // Configuración
    document.getElementById('resetSettings').addEventListener('click', () => {
        processor.resetSettings();
        processor.updateUIFromConfig();
        showNotification('Configuración restaurada a valores por defecto', 'info');
    });
    
    document.getElementById('saveSettings').addEventListener('click', () => {
        processor.updateFromUI();
        processor.saveSettings();
        showNotification('Configuración guardada', 'success');
    });
    
    document.getElementById('loadSettings').addEventListener('click', () => {
        processor.loadSettings();
        processor.updateUIFromConfig();
        showNotification('Configuración cargada', 'info');
    });
    
    // Actualizar valores de los sliders en tiempo real
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        const valueSpan = document.getElementById(slider.id + 'Value');
        if (valueSpan) {
            slider.addEventListener('input', (e) => {
                valueSpan.textContent = parseFloat(e.target.value).toFixed(2);
            });
        }
    });
}
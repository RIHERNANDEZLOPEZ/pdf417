export declare interface BKResult {
	
	error?: {
		name: string,
		message: string
	};
	
	resultsCount: number;
	barcodeTypeName?: string;
	textualData?: string;
	binaryData?: number[];
	gs1?: number;
	location?: {
		p1: { x:number, y:number },
		p2: { x:number, y:number },
		p3: { x:number, y:number },
		p4: { x:number, y:number }
	};
	capturedFrame?: ImageData,
	capturedBarcode?: ImageData,
	formattedJSON?: string;
	formattedText?: string;
	
	results?: {
		barcodeTypeName: string,
		textualData: string,
		binaryData: number[],
		gs1: number,
		location: {
			p1: { x:number, y:number },
			p2: { x:number, y:number },
			p3: { x:number, y:number },
			p4: { x:number, y:number }
		},
		capturedFrame?: ImageData,
		capturedBarcode?: ImageData,
		formattedJSON?: string;
		formattedText?: string;
	}[];
}

export declare enum DecodingSpeed {
	Fast = 0,
	Normal = 1,
	Slow = 2,
	Rigorous = 3
}

export declare enum Decoders {
	Aztec = 0,
	AztecCompact = 1,
	QR = 2,
	QRMicro = 3,
	Code128 = 4,
	Code93 = 5,
	Code39 = 6,
	Codabar = 7,
	Code11 = 8,
	Msi = 9,
	UpcA = 10,
	UpcE = 11,
	UpcE1 = 12,
	Ean13 = 13,
	Ean8 = 14,
	PDF417 = 15,
	PDF417Micro = 16,
	Datamatrix = 17,
	Code25 = 18,
	Interleaved25 = 19,
	ITF14 = 20,
	IATA25 = 21,
	Matrix25 = 22,
	Datalogic25 = 23,
	COOP25 = 24,
	Code32 = 25,
	Telepen = 26,
	Dotcode = 27,
	Databar14 = 29,
	DatabarLimited = 30,
	DatabarExpanded = 31,
	PostalIMB = 32,
	Postnet = 33,
	Planet = 34,
	AustralianPost = 35,
	RoyalMail = 36,
	KIX = 37,
	JapanesePost = 38,
	MaxiCode = 39
}

export declare enum Code11ChecksumType {
	disabled = 0,
	single = 1,
	double = 2
}

export declare enum Code39ChecksumType {
	disabled = 0,
	enabled = 1
}

export declare enum MsiChecksumType {
	disabled = 0,
	mod10 = 1,
	mod11 = 2,
	mod1010 = 3,
	mod1110 = 4,
	mod11IBM = 5,
	mod1110IBM = 6
}

export declare enum UpcEanDeblur {
	Disable = 0,
	Enable = 1
}

export declare enum MulticodeCachingEnabled {
	Disable = 0,
	Enable = 1
}

export declare enum EnableMisshaped1D {
	Disable = 0,
	Enable = 1
}

export declare enum EnableVINRestrictions {
	Disable = 0,
	Enable = 1
}

export declare enum EnableComposite {
	Disable = 0,
	Enable = 1
}

export declare enum Formatting {
	Disabled = 0,
	Automatic = 1,
	GS1 = 2,
	AAMVA = 3,
	SADL = 4
}

export declare enum EncodingCharacterSet {
	None = 0,
	ISO_8859_2 = 1,     // iso-8859-2 / latin2
	ISO_8859_5 = 2,     // iso-8859-5 / cyrillic
	Shift_JIS = 3,      // shift-jis
	US_ASCII = 4,       // us-ascii
	UTF_8 = 5,          // utf-8 (default)
	UTF_16 = 6,         // utf-16 (little endian)
	windows_1251 = 7,   // windows-1251
	windows_1256 = 8,   // windows-1256
	BINARY = 9          // BINARY
}

export declare enum CameraResolution {
	HD = 0,
	FHD = 1
}

export declare enum CenterMark {
	None = 0,
	Crosshair = 1
}

export declare enum LineScanAnimationMode {
	None = 0,
	NormalBlinking = 1,
	FastBlinking = 2
}

export declare enum BarkoderARMode {
	OFF = 0,
	InteractiveDisabled = 1,
	InteractiveEnabled = 2,
	NonInteractive = 3
}

export declare enum BarkoderARHeaderShowMode {
	NEVER = 0,
	ALWAYS = 1,
	ONSELECTED = 2
}

export declare enum BarkoderARLocationType {
	NONE = 0,
	TIGHT = 1,
	BOUNDINGBOX = 2
}

export declare interface Barkoder extends EventTarget {
	constants: {
		
		DecodingSpeed: typeof DecodingSpeed,
		
		Decoders: typeof Decoders,
		
		Code11ChecksumType: typeof Code11ChecksumType,
		
		Code39ChecksumType: typeof Code39ChecksumType,
		
		MsiChecksumType: typeof MsiChecksumType,
		
		UpcEanDeblur: typeof UpcEanDeblur,
		
		MulticodeCachingEnabled: typeof MulticodeCachingEnabled,
		
		EnableMisshaped1D: typeof EnableMisshaped1D,
		
		EnableVINRestrictions: typeof EnableVINRestrictions,
		
		EnableComposite: typeof EnableComposite,
		
		Formatting: typeof Formatting,
		
		EncodingCharacterSet: typeof EncodingCharacterSet,
		
		CameraResolution: typeof CameraResolution,
		
		CenterMark: typeof CenterMark,
		
		LineScanAnimationMode: typeof LineScanAnimationMode,
		
		BarkoderARMode: typeof BarkoderARMode,
		
		BarkoderARHeaderShowMode: typeof BarkoderARHeaderShowMode,
		
		BarkoderARLocationType: typeof BarkoderARLocationType
	};
  
  configureBarkoder: (barkoderConfig: object) => boolean;
  scanImage: (imageUri: string, resultCallback?: (result: BKResult) => void) => void | Promise<BKResult>;
  scanFrame: (imageData: ImageData | string, resultCallback?: (result: BKResult) => void) => void | Promise<BKResult>;
  setDecodingSpeed: (decodingSpeed: DecodingSpeed) => number;
  setEnabledDecoders: (...decoders: Decoders[]) => void;
  getEnabledDecoders: () => number[];
  setUpcEanDeblur: (upcEanDeblur: UpcEanDeblur) => number;
  getRegionOfInterest: () => { x: number, y: number, width: number, height: number };
  setRegionOfInterest: (left: number, top: number, width: number, height: number) => void;
  setLengthRange: (decoder: Decoders, minLength: number, maxLength: number) => number;
  setCustomOption: (customOption: string, value: number) => number;
  getSADLImage: (jsonString: string) => Promise<ImageData>;
  setFormatting: (formatting: Formatting) => number;
  setDuplicatesDelayMs: (duplicatesDelayMs: number) => number;
  setEncodingCharacterSet: (encodingCharacterSet: EncodingCharacterSet) => number;
  setMulticodeCachingEnabled: (multicodeCachingEnabled: MulticodeCachingEnabled) => number;
  setMulticodeCachingDuration: (multicodeCachingDuration: number) => number;
  setMaximumResultsCount: (maximumResultsCount: number) => number;
  setEnableMisshaped1D: (enableMisshaped1D: EnableMisshaped1D) => number;
  setEnableVINRestrictions: (enableVINRestrictions: EnableVINRestrictions) => number;
  setEnableComposite: (enableComposite: EnableComposite) => number;
  getDecodingSpeed: () => number;
  getUpcEanDeblur: () => number;
  getFormatting: () => number;
  getDuplicatesDelayMs: () => number;
  getMaximumResultsCount: () => number;
  getEnableMisshaped1D: () => number;
  getEnableVINRestrictions: () => number;
  getEnableComposite: () => number;
  getEncodingCharacterSet: () => number;
  getMsiChecksumType: () => number;
  getCode39ChecksumType: () => number;
  getCode11ChecksumType: () => number;
  getDatamatrixDpmModeEnabled: () => boolean;
  isBarcodeTypeEnabled: (decoder: number) => boolean | -1;
  setBarcodeTypeEnabled: (decoder: number, enable: boolean) => number;
  getBarcodeTypeLengthRange: (decoder: number) => [number, number] | -1;
  getMulticodeCachingEnabled: () => number;
  getMulticodeCachingDuration: () => number;
  setCode11ChecksumType: (code11ChecksumType: Code11ChecksumType) => number;
  setCode39ChecksumType: (code39ChecksumType: Code39ChecksumType) => number;
  setMsiChecksumType: (msiChecksumType: MsiChecksumType) => number;
  setDatamatrixDpmModeEnabled: (dpmModeEnabled: boolean) => number;
  setQRDpmModeEnabled: (dpmModeEnabled: boolean) => number;
  setQRMicroDpmModeEnabled: (dpmModeEnabled: boolean) => number;
  setFlashEnabled: (flashEnabled: boolean) => number;
  setZoomEnabled: (zoomEnabled: boolean) => number;
  setCloseEnabled: (closeEnabled: boolean) => number;
  setCameraPickerEnabled: (cameraPickerEnabled: boolean) => number;
  changeFlashState: () => void;
  changeZoomState: () => void;
  setTargetZoom: (targetZoom: number) => void;
  getTargetZoom: () => number;
  getMaxZoomFactor: () => number;
  isFlashAvailable: () => boolean;
  setCameraResolution: (camRes: CameraResolution) => number;
  setDpsLimit: (dpsLimit: number) => number;
  setScannerTimeout: (timeout_ms: number) => number;
  setContinuous: (continuous: boolean) => number;
  setBeepOnSuccessEnabled: (beepEnabled: boolean) => number;
  setStopOnCameraInitEnabled: (stopOnCameraInitEnabled: boolean) => number;
  setContainerOptions: (containerOptions: { width: number, height: number, overrideSize: boolean, useFallbackSize: boolean }) => number;
  getCameraResolution: () => number;
  getContinuous: () => boolean;
  isBeepOnSuccessEnabled: () => boolean;
  applyTemplate: (templateFile: string, templateMode: string) => Promise<{ returnValue: number, error?: { name: string, message: string } }>;
  startScanner: (resultCallback?: (result: BKResult) => void) => void;
  stopScanner: () => void;
  setCameraId: (id: string) => void;
  getActiveCamera: () => string | null;
  getCameras: () => Promise<{ id: string, label: string }[]>;
  setPauseDecoding: (pause: boolean) => void;
  setLocationLineColor: (color: string) => void;
  setLocationLineWidth: (width: number) => void;
  setSelectedLocationColor: (color: string) => void;
  setNonSelectedLocationLineColor: (color: string) => void;
  setSelectedLocationLineWidth: (width: number) => void;
  setNonSelectedLocationLineWidth: (width: number) => void;
  setHeaderHeight: (height: number) => void;
  setLocationTransitionSpeed: (transitionSpeed: number) => void;
  setResultDisappearanceDelayMs: (disappearanceDelayMs: number) => void;
  setDoubleTapToFreezeEnabled: (enabled: boolean) => void;
  setARMode: (arMode: BarkoderARMode) => void;
  setHeaderShowMode: (headerShowMode: BarkoderARHeaderShowMode) => void;
  setLocationType: (locationType: BarkoderARLocationType) => void;
  setHeaderTextColorSelected: (color: string) => void;
  setHeaderTextColorNonSelected: (color: string) => void;
  setRoiCenterMark: (centerMark: CenterMark) => void;
  setLineScanAnimationMode: (animationMode: LineScanAnimationMode) => void;
  setLineScanColor: (color: string) => void;
  setLineScanWidth: (width: number) => void;
  setRoiLineColor: (color: string) => void;
  setRoiOverlayBackgroundColor: (color: string) => void;
  setRoiLineWidth: (width: number) => void;
  setRegionOfInterestVisible: (visible: boolean) => void;
  setImageResultEnabled: (enabled: boolean) => void;
  setLocationInImageResultEnabled: (enabled: boolean) => void;
  setBarcodeThumbnailOnResultEnabled: (enabled: boolean) => void;
  setLocationInPreviewEnabled: (enabled: boolean) => void;
  getLocationLineColor: () => string;
  getLocationLineWidth: () => number;
  getSelectedLocationColor: () => string;
  getNonSelectedLocationLineColor: () => string;
  getSelectedLocationLineWidth: () => number;
  getNonSelectedLocationLineWidth: () => number;
  getHeaderHeight: () => number;
  getLocationTransitionSpeed: () => number;
  getResultDisappearanceDelayMs: () => number;
  getDoubleTapToFreezeEnabled: () => boolean;
  getARMode: () => number;
  getHeaderShowMode: () => number;
  getLocationType: () => number;
  getHeaderTextColorSelected: () => string;
  getHeaderTextColorNonSelected: () => string;
  getRoiLineColor: () => string;
  getRoiOverlayBackgroundColor: () => string;
  getRoiLineWidth: () => number;
  getRoiCenterMark: () => number;
  getLineScanAnimationMode: () => number;
  getLineScanColor: () => string;
  getLineScanWidth: () => number;
  isRegionOfInterestVisible: () => boolean;
  isImageResultEnabled: () => boolean;
  isLocationInImageResultEnabled: () => boolean;
  isBarcodeThumbnailOnResultEnabled: () => boolean;
  isLocationInPreviewEnabled: () => boolean;
  scanFromLocalFileSystem: (input: FileList, result_callback: (result: BKResult) => void) => void;
  getVersion: () => { barkoderWebVersion: string, barkoderVersion: string, barkoderFullVersion: string };
}

export declare function initialize(key: string): Promise<Barkoder>;
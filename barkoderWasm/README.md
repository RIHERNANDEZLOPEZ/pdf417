# barKoder Barcode Scanner Web SDK 
## Enterprise-grade barcode scanner SDK for the Web

The [barKoder Barcode Scanner SDK](https://barkoder.com/barcode-scanner-sdk) will fully transform the user's smartphones and tablets that deploy your Enterprise and Consumer apps into rugged barcode scanning devices without the need to procure and maintain expensive and sluggish hardware devices that have a very short life span.

Even though the barKoder barcode scanner SDK is a relatively new product, it is already more advanced than other competitor API's. Its robust barcode reading engine can be used to read the content of the most widely used barcodes with lightning fast speed and unprecedented recognition rate:

1D - [Codabar](https://barkoder.com/barcode-types/codabar), [Code 11](https://barkoder.com/barcode-types/code-11), [Code 25](https://barkoder.com/barcode-types/code-25), [Code 39](https://barkoder.com/barcode-types/code-39), [Code 93](https://barkoder.com/barcode-types/code-93), [Code 128](https://barkoder.com/barcode-types/code-128), [EAN-8](https://barkoder.com/barcode-types/ean-upc-code), [EAN-13](https://barkoder.com/barcode-types/ean-upc-code), [Interleaved 2 of 5](https://barkoder.com/barcode-types/code-25), [ITF-14](https://barkoder.com/barcode-types/code-25), [MSI Plessey](https://barkoder.com/barcode-types/msi-plessey), [Pharmacode](https://barkoder.com/barcode-types/code-32), [Telepen](https://barkoder.com/barcode-types/telepen), [UPC-A](https://barkoder.com/barcode-types/ean-upc-code) & [UPC-E](https://barkoder.com/barcode-types/ean-upc-code)
2D - [Aztec Code](https://barkoder.com/barcode-types/aztec), [Aztec Compact](https://barkoder.com/barcode-types/aztec), [Data Matrix](https://barkoder.com/barcode-types/data-matrix), [DotCode](https://barkoder.com/barcode-types/dotcode), [PDF417](https://barkoder.com/barcode-types/pdf417), [Micro PDF417](https://barkoder.com/barcode-types/pdf417), [QR Code](https://barkoder.com/barcode-types/qr-code) & [Micro QR Code](https://barkoder.com/barcode-types/qr-code)

The [barKoder SDK](https://barkoder.com/) features multiple algorithms that handle a wide variety of barcode scanning scenarios with unprecedented performance in terms of speed and success rate: 
* [DPM Mode](https://barkoder.com/dpm-barcode-scanner-sdk) - Specially designed scanning template for decoding Data Matrix barcodes engraved using any Direct Part Marking (DPM) technique;
* [MatrixSight](https://barkoder.com/matrixsight) - Proprietary algorithm that can successfully scan QR Codes or Data Matrix barcodes even when they are missing their finder, timing and/or alignment patterns, even part of the data elements;
* [Segment Decoding](https://barkoder.com/segment-decoding) - The advanced barcode localization techniques implemented into the barKoder SDK grants an ability to recognize 1D barcodes that have significant deformations along their Z axis, getting especially handy when trying to recognize barcodes found on test tubes, bottles and other surfaces with rounded, curved, hollowed or otherwise irregular shapes;
* [VIN Barcode Scanning Mode](https://barkoder.com/vin-scanning-mode) - The most advanced VIN barcode scanning mode on the market, utilizing all the special algorithms of the barKoder SDK leading to the ultimate scanning experience of any kind of barcodes used for embedding Vehicle Identification Numbers, including Code 39, Code 128, QR Code and Data Matrix;
* [DeBlur Mode](https://barkoder.com/deblur-mode) - Whether there's lens, motion or focus blur present in EAN or UPC barcodes, the barKoder DeBlur Mode alleviates it fully and doesn't allow the scanning experience to suffer;
* [PDF417-LineSight](https://barkoder.com/pdf417-linesight) - The robust PDF417 barcode scanner SDK that is offered by barKoder can detect even the most severely damaged PDF417 codes, including missing their start and stop patterns, stop row indicators or even entire data columns, making it the sublime choice for apps that need to reliably scan US or Canadian driver's licenses, South African vehicle license discs or driver's licenses, as well as various types of ID's such as Military, Argentinian, Colombian or South African Smart ID Cards.
* [Batch MultiScan](https://barkoder.com/batch-multiscan) - The Batch MultiScan feature of the barKoder Barcode Scanner SDK for mobile apps and websites, will enable your users to decode multiple barcodes regardless of their type or size in one go. The barKoder API covers all common 1D and 2D barcode symbologies, enabling intuitive and fast data capture while delivering an accuracy of at least 99%, even under the most difficult scanning conditions. Whether in inventory counting, on the last mile or in manufacturing, our fast and accurate Batch MultiScan algorithm greatly increases efficiency and helps create friction-less internal and external processes. The Batch MultiScan works with smartphones, tablets and industrial cameras, enabling true mobility wherever it’s applied.									 

You can check out our free demo app Barcode Scanner by barKoder available both via [Apple App Store](https://apps.apple.com/us/app/barkoder-scanner/id6443715409?uo=2) & [Google Play Store](https://play.google.com/store/apps/details?id=com.barkoder.demoscanner).


## Trial License

If you run the barKoder Barcode Scanner SDK without a valid trial or production license, all results upon successful barcode scans will be partially masked by asterisks (*). You can get a trial license simply by [registering on the barKoder Portal](https://barkoder.com/register) and utilizing the self-service for [Evaluation License Generation](https://barkoder.com/spr/new)! Each trial license will be good for an initial duration of 30 days and can be deployed to up to 25 devices. For any custom requirements, contact our sales team via sales@barkoder.com

Note that a trial license is only supposed to be utilized in a development or staging environment.

## Free Developer Support

Our support is completely free for integration or testing purposes and granted through the [barKoder Portal](https://barkoder.com/login). After registering and logging into your account, you only need to submit a [Support Issue](https://barkoder.com/issues) form. Alternatively, you can contact us by email via support@barkoder.com.

## Requirements

WebAssembly is a type of code that can be run in modern web browsers — it is a low-level assembly-like language with a compact binary format that runs with near-native performance and is designed to run alongside JavaScript. The following requirements need to be met:

1. **Client:**
   - Chrome 67+, Firefox 69+, Edge 79+, Safari 14+, iOS Safari 14+
   - Camera usage permission (if using startScanner)
2. **Server:**
   - HTTPS, MIME type for wasm files

## Install

```bash
	npm install barkoder-wasm
```

## Install Manually
If you would like to install from a local folder you will need to follow these steps:

- Download zip
- Unpack zip file
- Rename folder to your liking
- Paste the folder in app directory i.e. **myApp/barkoder-wasm** (this is the new name of the download module folder)
- Finally in your cli (within your app's directory):
```bash
	npm install "./barkoder-wasm"
```

## Using the SDK
### Browser

Copy both barkoder-umd.js and barkoder.wasm to your page's directory.

Include the barkoder-umd.js script:
```html
	<script type="text/javascript" src="barkoder-umd.js"></script>
```

### CommonJS

Copy barkoder.wasm to your page's directory (i.e. dist).

Require the UMD Module:

```js
	var BarkoderSDK = require('barkoder-wasm');
```

Then,

 - In your js file:
```js
async function barkoderInit () {
	var Barkoder = await BarkoderSDK.initialize("your_license_key_here");
	
	//enable symbologies you'd like to scan
	Barkoder.setEnabledDecoders(
		Barkoder.constants.Decoders.QR,
		Barkoder.constants.Decoders.Ean8,
		Barkoder.constants.Decoders.PDF417
	);
	
	//change any additional settings
	Barkoder.setCameraResolution(Barkoder.constants.CameraResolution.FHD);
	Barkoder.setDecodingSpeed(Barkoder.constants.DecodingSpeed.Normal);
}

barkoderInit(); //using await requires an async method
```

 - In your HTML file add a div with barkoder-container id:
```html
	<div id="barkoder-container" style="width: 500px; height: 300px;"></div> 
```
Additionally add style for size, position, background color, etc.
Note that the container element needs to have a defined size, otherwise the SDK will set half the window size as fallback.

 - Finally, you are ready to scan:
```js
	let callbackMethod = (result)=>alert(result.barcodeTypeName + '\n' + result.textualData);

	Barkoder.startScanner(callbackMethod);
	Barkoder.stopScanner();

	Barkoder.scanImage('test.png', callbackMethod);
```

<br>

## API

* [`initialize(key: string): Promise<object>`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference)

The initialize method must be called first. After it completes, it returns an object with the following members:

* [`constants: object`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#barkoder-constants)
* [`startScanner(resultCallback?: function): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#startscanner-resultcallback-function-number)
* [`stopScanner()`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#stopscanner)
* [`scanImage(imageUri: string, resultCallback?: function)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#scanimage-imageuri-string-resultcallback-function)
* [`scanFromLocalFileSystem(input: string, resultCallback: function): void`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#scanfromlocalfilesystem)
* [`setPauseDecoding(pause: boolean)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setpausedecoding-pause-boolean)
* [`setRegionOfInterest(left: number, top: number, width: number, height: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setregionofinterest-left-number-top-number-width-number-height-number)
* [`setCameraResolution(cameraResolution: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcameraresolution-cameraresolution-number)
* [`getCameras(): Promise<object>`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getcameras)
* [`setCameraId(cameraId: string)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcameraid-cameraid-string)
* [`setFlashEnabled(flashEnabled: boolean): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setflashenabled-flashenabled-boolean-number)
* [`setZoomEnabled(zoomEnabled: boolean): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setzoomenabled-zoomenabled-boolean-number)
* [`setCloseEnabled(closeEnabled: boolean): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcloseenabled-closeenabled-boolean-number)
* [`setCameraPickerEnabled(cameraPickerEnabled: boolean): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcamerapickerenabled-camerapickerenabled-boolean-number)
* [`changeFlashState()`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#changeflashstate)
* [`changeZoomState()`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#changezoomstate)
* [`setContinuous(continuous: boolean): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcontinuous-continuous-boolean-number)
* [`setScannerTimeout(timeout: number): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setscannertimeout-timeout-number)
* [`setDpsLimit(setDpsLimit: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setdpslimit)
* [`applyTemplate(templateFile: string, templateMode: string)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#applytemplate-templatefile-string-templatemode-string)
* [`setLengthRange(decoder: number, minimumLength: number, maximumLength: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setlengthrange-decoder-number-minimumlength-number-maximumlength-number)
* [`setCode11ChecksumType(code11ChecksumType: number): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcode11checksumtype-code11checksumtype-number-number)
* [`setCode39ChecksumType(code39ChecksumType: number): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcode39checksumtype-code39checksumtype-number-number)
* [`setMsiChecksumType(msiChecksumType: number): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setmsichecksumtype-msichecksumtype-number-number)
* [`setDatamatrixDpmModeEnabled(dpmModeEnabled: boolean): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setdatamatrixdpmmodeenabled-dpmmodeenabled-boolean-number)
* [`setEncodingCharacterSet(encodingCharacterSet: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setencodingcharacterset-encodingcharacterset-number)
* [`setDecodingSpeed(decodingSpeed: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setdecodingspeed)
* [`setEnabledDecoders(...args: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setenableddecoders-args-number)
* [`setFormatting(formatting: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setformatting)
* [`setMulticodeCachingEnabled(multicodeCachingEnabled: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setmulticodecachingenabled-multicodecachingenabled-number)
* [`setMulticodeCachingDuration(multicodeCachingDuration: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setmulticodecachingduration-multicodecachingduration-number)
* [`setMaximumResultsCount(maximumResultsCount: number): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setmaximumresultscount)
* [`setDuplicatesDelayMs(duplicatesDelayMs: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setduplicatesdelayms-duplicatesdelayms-number)
* [`setUpcEanDeblur(deblur: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setupceandeblur-deblur-number)
* [`setEnableMisshaped1D(enableMisshaped1D: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setenablemisshaped1d-enablemisshaped1d-number)
* [`setEnableVINRestrictions(enableVINRestrictions: number)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setenablevinrestrictions-enablevinrestrictions-number)
* [`getVersion(): { barkoderWebVersion: string, barkoderVersion: string, barkoderFullVersion: string }`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getversion-barkoderwebversion-string-barkoderversion-string-barkoderfullversion-string)
* [`getRegionOfInterest(): { x:number, y:number, width: number, height: number }`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getregionofinterest-x-number-y-number-width-number-height-number)
* [`getDecodingSpeed(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getdecodingspeed)
* [`getFormatting(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getformatting)
* [`getMaximumResultsCount(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getmaximumresultscount)
* [`getDuplicatesDelayMs(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getduplicatesdelayms)
* [`getUpcEanDeblur(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getupceandeblur-number)
* [`getEnableMisshaped1D(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getenablemisshaped1d-number)
* [`getEnableVINRestrictions(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getenablevinrestrictions-number)
* [`getLocationLineColor(): string`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getlocationlinecolor-string)
* [`getLocationLineWidth(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getlocationlinewidth-number)
* [`getRoiLineColor(): string`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getroilinecolor-string)
* [`getRoiLineWidth(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getroilinewidth-number)
* [`isRegionOfInterestVisible(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#isregionofinterestvisible-boolean)
* [`isImageResultEnabled(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#isimageresultenabled-boolean)
* [`isLocationInPreviewEnabled(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#islocationinpreviewenabled-boolean)
* [`setRoiLineColor(lineColor: string): void`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setroilinecolor)
* [`setRoiLineWidth(lineWidth: number): void`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setroilinewidth)
* [`setImageResultEnabled(enabled: boolean): void`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setimageresultenabled)
* [`setLocationInPreviewEnabled(enabled: boolean): void`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setlocationinpreviewenabled)
* [`setRegionOfInterestVisible(visible: boolean): void`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setregionofinterestvisible)
* [`configureBarkoder(barkoderConfig: BarkoderConfig)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#configurebarkoder)
* [`isBarcodeTypeEnabled(barcodeType: number): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#isbarcodetypeenabled)
* [`setBarcodeTypeEnabled(barcodeType: number, enabled: boolean): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setbarcodetypeenabled)
* [`getBarcodeTypeLengthRange(barcodeType: number): [mix: number, max: number]`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getbarcodetypelengthrange)
* [`getMulticodeCachingEnabled(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getmulticodecachingenabled)
* [`getMulticodeCachingDuration(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getmulticodecachingduration)

* [`setBeepOnSuccessEnabled(enabled: boolean)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setbeeponsuccessenabled)
* [`getActiveCamera(): string`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getactivecamera)
* [`setQRDpmModeEnabled(enabled: boolean)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setqrdpmmodeenabled)
* [`setQRMicroDpmModeEnabled(enabled: boolean)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setqrmicrodpmmodeenabled)
* [`getDatamatrixDpmModeEnabled(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getdatamatrixdpmmodeenabled)
* [`setBarcodeThumbnailOnResultEnabled(enabled: boolean)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setbarcodethumbnailonresultenabled)
* [`isBarcodeThumbnailOnResultEnabled(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#isbarcodethumbnailonresultenabled)
* [`getMaxZoomFactor(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getmaxzoomfactor)
* [`isFlashAvailable(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#isflashavailable)
* [`setEnableComposite(enableComposite: boolean)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setenablecomposite)
* [`getEnableComposite(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getenablecomposite)
* [`getEnabledDecoders(): number[]`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getenableddecoders)
* [`setRoiOverlayBackgroundColor(color: string)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setroioverlaybackgroundcolor)
* [`setLocationInImageResultEnabled(enabled: boolean)`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setlocationinimageresultenabled)
* [`getRoiOverlayBackgroundColor(): string`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getroioverlaybackgroundcolor)
* [`isLocationInImageResultEnabled(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#islocationinimageresultenabled)
* [`setLocationLineColor(color: string): void`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setlocationlinecolor)
* [`getCameraResolution(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getcameraresolution)
* [`getEncodingCharacterSet(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getencodingcharacterset)
* [`getMsiChecksumType(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getmsichecksumtype)
* [`getCode11ChecksumType(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getcode11checksumtype)
* [`getCode39ChecksumType(): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getcode39checksumtype)
* [`getContinuous(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#getcontinuous)
* [`isBeepOnSuccessEnabled(): boolean`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#isbeeponsuccessenabled)
* [`setStopOnCameraInitEnabled(stopOnCameraInitEnabled: boolean): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setstoponcamerainitenabled)
* [`setContainerOptions(containerOptions: { width: number, height: number, overrideSize: boolean, useFallbackSize: boolean }): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcontaineroptions)
* [`setCustomOption(customOption: string, value: number): number`](https://barkoder.com/docs/v1/barkoder-web-sdk/web-sdk-for-barkoder-api-reference#setcustomoption)

<br>
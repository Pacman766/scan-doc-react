import {Scanner} from "./scanner";
import {Config, defaultTempConfig} from "./config";
import {ISFResponse, ISFFResponse, File} from "./scanFiles"




export {};

declare global {
    interface Window {
        IsidaImageScanning?: {
            getScannersList: () => Promise<{ scanners: Scanner[]}>;
            getImageScanningFiles: (
                {scannerId: string, workingDirectory: string, settings: defaultTempConfig}) => Promise<ISFResponse>;
            getImageScanningFromFiles: ({files: File}) => Promise<ISFFResponse>
        }
    }
}
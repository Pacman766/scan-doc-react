export interface Scanner {
    scannerName: string;
    scannerId: number;
}

export interface ScannerState {
    scanner: Scanner[] | null,
    error: null | string
}

export const initialState: ScannerState = {
    scanner: [{
        scannerId: 1,
        scannerName: ''
    }],
    error: null
}
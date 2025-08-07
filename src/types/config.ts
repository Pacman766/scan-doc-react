export type Config = {
    scannerId: number;
    workingDirectory: string;
    dpi?: number | string;
    color: 'bw' | 'gray' | 'rgb';
    feeder?: boolean;
    duplex?: boolean;
    format?: {
        type?: string;
        quality?: number;
    }
}

export const defaultTempConfig : Config = {
    scannerId: 1,
    workingDirectory : "c:\\tmp",
    dpi: '',
    color: 'bw',
    feeder: false,
    duplex: false,
    format: {
        type: 'jpeg',
        quality: 50
    }
}
export type Config = {
    scannerId: number;
    workingDirectory?: string;
    dpi: number;
    color: 'bw' | 'gray' | 'rgb';
    feeder: boolean;
    duplex: boolean;
    format?: {
        type?: string;
        quality?: number;
    }
}

export const defaultTempConfig : Config = {
    scannerId: 1,
    workingDirectory: "c:\\tmp",
    dpi: 100,
    color: 'bw',
    feeder: false,
    duplex: false,
    format: {
        type: 'jpeg',
        quality: 50
    }
}

export enum ConfigActions {
    GET_CONFIG = 'GET_CONFIG',
    GET_CONFIG_ERROR = 'GET_CONFIG_ERROR',
    SAVE_CONFIG = 'SAVE_CONFIG',
    SAVE_CONFIG_ERROR = 'SAVE_CONFIG_ERROR',
}

interface GetConfigAction {
    type: ConfigActions.GET_CONFIG,
    payload: Config
}

interface GetConfigErrorAction {
    type: ConfigActions.GET_CONFIG_ERROR,
    payload: string
}

interface SaveConfigAction {
    type: ConfigActions.SAVE_CONFIG,
}

interface SaveConfigErrorAction {
    type: ConfigActions.SAVE_CONFIG_ERROR,
    payload: string
}

export interface ConfigState {
    config: Config | null;
    error: null | string;
}

export type ConfigActionsType = GetConfigAction | GetConfigErrorAction | SaveConfigAction | SaveConfigErrorAction;

export const initialState: ConfigState = {
    config: defaultTempConfig,
    error: null
}
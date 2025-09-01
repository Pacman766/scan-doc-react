import axios from 'axios';
import type {Scanner} from '../types/scanner'
import {Config} from "../types/config";
import {useAppStore} from "../store";
import { setScanners } from '../store/slices/scannerSlice';

export const useConfig = () => {
    const store = useAppStore();
    const getScanners = async (): Promise<Scanner[]> => {
        if (!window.IsidaImageScanning) {
            console.warn('IsidaImageScanning is not available');
            return [];
        }

        try {
            const result = await window.IsidaImageScanning.getScannersList();
            store.dispatch(setScanners(result.scanners));
            return result.scanners;
        } catch (e: any) {
            console.log(e.status?.description || e.message);
            return [];
        }
    }

    const getConfig = async () => {
        const response = await axios.get('/portal/rs/scan/config');
        console.log('config', response.data);
        return response.data;
    }

    const saveConfig = async (newConfig: Config) => {
        const response = await axios.put('/portal/rs/scan/config/save', newConfig);

        return response.data;
    }

    return {
        getScanners,
        saveConfig
    };
};
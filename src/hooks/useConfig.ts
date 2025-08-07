import {useState} from 'react';
import axios from 'axios';
import type {Scanner} from '../types/scanner'
import {Config, defaultTempConfig} from "../types/config";

export const useConfig = () => {
    const [config, setConfig] = useState<Config>(defaultTempConfig);
    const [scanners, setScanners] = useState<Scanner[]>([]);

    const getScanners = async (): Promise<Scanner[]> => {
        if (!window.IsidaImageScanning) {
            console.warn('IsidaImageScanning is not available');
            return [];
        }

        try {
            const result = await window.IsidaImageScanning.getScannersList();
            setScanners(result.scanners);
            return result.scanners;
        } catch (e: any) {
            console.log(e.status?.description || e.message);
            return [];
        }
    }

    const getConfig = async () => {
        try {
            const response = await axios.get('/portal/rs/scan/config');
            setConfig(response.data);
            console.log('config', response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    const saveConfig = async (newConfig: Config) => {
        try {
            const response = await axios.put('/portal/rs/scan/config/save', newConfig);
            if (response.status === 200) {
                setConfig(newConfig);
                console.log('Settings saved:', newConfig);
            }
        } catch (e) {
            console.log('Failed to fetch data: ', e);
        }
    }


    return {
        config,
        getScanners,
        getConfig,
        scanners,
        saveConfig,
    };
};
import {useState} from 'react';
import axios from 'axios';

export const useConfig = () => {
    const [config, setConfig] = useState({});
    const [scanners, setScanners] = useState([]);

    const getScanners = async () => {
        if (!window.IsidaImageScanning) {
            console.warn('IsidaImageScanning is not available');
            return;
        }

        try {
            const result = await window.IsidaImageScanning.getScannersList();
            setScanners(result.scanners);
            return result.scanners;
        } catch (e) {
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

    const saveConfig = async (newConfig) => {
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
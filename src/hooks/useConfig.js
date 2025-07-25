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

        await window.IsidaImageScanning.getScannersList()
            .then(result => {
                console.log(result.scanners);
                setScanners(result.scanners);
            })
            .catch(error => {
                console.log(error.status.description);
            })
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
            const response = await axios.put('/portal/rs/scan/config/save', config);
            if (response.status === 200) {
                setConfig(newConfig);
                console.log('Settings saved:', newConfig);
            }
        } catch (e) {
            console.log('Failed to fetch data: ', e);
        }
    }

    const changeConfig = async (newConfig) => {
        await saveConfig(newConfig);
    }


    return {
        config,
        scanners,
        setConfig,
        getScanners,
        getConfig,
        saveConfig,
        changeConfig };
};
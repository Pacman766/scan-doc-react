import {useState} from 'react';
import axios from 'axios';

export const useConfig = (scanners, setScanners) => {
    const [config, setConfig] = useState({});

    const getScanners = async () => {
        if (!window.IsidaImageScanning){
            console.warn('IsidaImageScanning is not available');
            return;
        }

        window.IsidaImageScanning.getScannersList()
            .then(result => {
                console.log(result.status.result);
                setScanners(result.scanners);
                console.log(scanners);
            })
            .catch(error => {
                console.log(error.status.description);
            })
    }

    const getConfig = async () => {
        try {
            const response = await axios.get('/portal/rs/scan/config');
            setConfig(response.data);
            console.log('config', config);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    const saveConfig = async () => {
        try {
            const response = await axios.put('/portal/rs/scan/config/save', config);
            if (response === 200){
                console.log('Settings saved: ' + JSON.parse(response.config.data));
            }
        } catch (e) {
            console.log('Failed to fetch data: ', e);
        }
    }

    const changeConfig = async (conf, scanName, setActive) => {
        setConfig(conf);
        setActive(false);
        await saveConfig(config);
    }


    return {config, getScanners, getConfig};
};
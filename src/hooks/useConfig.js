import React, {useState} from 'react';
import axios from 'axios';

export const useConfig = (scanners, setScanners) => {
    const [config, setConfig] = useState({});

    const getScanners = async () => {
        IsidaImageScanning.getScannersList()
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

    return {config, getScanners, getConfig};
};
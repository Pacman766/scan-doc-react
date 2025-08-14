import React, {useState, useEffect} from 'react';
import {Modal, Row, Col, Form} from 'react-bootstrap';
import ButtonDefault from './buttonDefault/ButtonDefault';
import SettingsDropdown from './settingsDropdown/SettingsDropdown';
import {IoSettingsOutline} from "react-icons/io5";
import type {SettingsDialogProps} from "../types/settingsDialog";
import type {Scanner} from "../types/scanner";
import {Config, defaultTempConfig} from "../types/config";
import {store} from "../store";


const SettingsDialog = (
    {getScanners, saveConfig }:
        SettingsDialogProps
) => {

    const [settingsShow, setSettingsShow] = useState(false);
    const [tempConfig, setTempConfig] = useState<Config>(defaultTempConfig);
    const [scannerNames, setScannerNames] = useState<string[]>([]);
    const resolutionOptions = [100, 200, 300, 400, 500];
    const colorOptions = ["Оттенки серого", "Цветной", "Черно-белый"];
    const [tempSelectedColor, setTempSelectedColor] = useState<string>('');
    const colorMapping  = {
        bw: 'Черно-белый',
        gray: 'Оттенки серого',
        rgb: 'Цветной'
    };
    const reverseColorMapping: Record<string, 'bw' | 'gray' | 'rgb'> = {
        'Черно-белый': 'bw',
        'Оттенки серого': 'gray',
        'Цветной': 'rgb'
    };

    const openSettingsWindow = async () => {
        const scannersList: Scanner[] | undefined = await getScanners();
        setScannerNames(scannersList.map(s => s.scannerName));
        const config = store.getState().config.config;
        if (config){
            setTempConfig(config);
            setTempSelectedColor(colorMapping[config.color]);
        }
        setSettingsShow(true);
    };

    const closeSettingsWindow = () => {
        setSettingsShow(false);
    };

    const handleSave = () => {
        saveConfig(tempConfig);
        setSettingsShow(false);
    };

    return (
        <>
            <ButtonDefault
                icon={<IoSettingsOutline color="#AFB2B6" />}
                tooltip={"Настройки"}
                onClick={openSettingsWindow}
            />

            <Modal
                show={settingsShow}
                onHide={closeSettingsWindow}
                size="lg"
                centered
                bg="dark"
                data-bs-theme="dark"
            >
                <Modal.Header closeButton onClick={closeSettingsWindow}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Настройки
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SettingsDropdown
                        title="Сканер*"
                        data={scannerNames}
                        selected={scannerNames[0]}
                        onSelect={(value) => {
                            setTempConfig((prev) => ({
                                ...prev,
                                scannerName: value
                            }))
                        }}
                    />

                    <Row className="mb-3">
                        <Col md={6}>
                            <SettingsDropdown
                                title="Разрешение"
                                data={resolutionOptions}
                                selected={tempConfig?.dpi}
                                onSelect={(value) => setTempConfig(prev => ({
                                    ...prev,
                                    dpi: value
                                }))}
                            />
                        </Col>
                        <Col md={6}>
                            <SettingsDropdown
                                title="Цветовой формат"
                                data={colorOptions}
                                selected={tempSelectedColor}
                                onSelect={(value) => {
                                    setTempSelectedColor(value);
                                    setTempConfig((prev) => ({
                                        ...prev,
                                        color: reverseColorMapping[value]
                                    }));
                                }}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Check
                                id="feeder-checkbox"
                                type="checkbox"
                                label="Поточное сканирование"
                                checked={tempConfig.feeder}
                                onChange={() =>
                                    setTempConfig((prev) => ({
                                        ...prev,
                                        feeder: !prev.feeder
                                    }))
                                }
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Check
                                id="duplex-checkbox"
                                type="checkbox"
                                label="Двустороннее"
                                checked={tempConfig.duplex}
                                disabled={!tempConfig.feeder}
                                onChange={() =>
                                    setTempConfig((prev) => ({
                                        ...prev,
                                        duplex: !prev.duplex
                                    }))
                                }
                            />
                        </Col>
                    </Row>

                    <small className="text-muted d-block mt-3">* обязательные для заполнения поля</small>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonDefault tooltip={"Сохранить"} onClick={handleSave} text={"Сохранить"}></ButtonDefault>
                    <ButtonDefault tooltip={"Настройки"} onClick={closeSettingsWindow} text={"Отмена"}></ButtonDefault>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SettingsDialog;
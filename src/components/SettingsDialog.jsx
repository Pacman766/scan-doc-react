import React, {useState, useEffect} from 'react';
import {Modal, Row, Col, Form} from 'react-bootstrap';
import ButtonDefault from './buttonDefault/ButtonDefault';
import SettingsDropdown from './settingsDropdown/SettingsDropdown';
import {IoSettingsOutline} from "react-icons/io5";

const SettingsDialog = ({getScanners, scanners, config, saveConfig }) => {
    const [settingsShow, setSettingsShow] = useState(false);
    const [tempConfig, setTempConfig] = useState({});
    const [scannerNames, setScannerNames] = useState([]);
    const resolutionOptions = [100, 200, 300, 400, 500];
    const colorOptions = ["Оттенки серого", "Цветной", "Черно-белый"];
    const [tempSelectedColor, setTempSelectedColor] = useState('');
    const colorMapping = {
        bw: 'Черно-белый',
        gray: 'Оттенки серого',
        rgb: 'Цветной'
    };
    const reverseColorMapping = {
        'Черно-белый': 'bw',
        'Оттенки серого': 'gray',
        'Цветной': 'rgb'
    };

    useEffect(() => {
        setTempConfig(config);
    }, [config]);


    const openSettingsWindow = async () => {
        const scannersList = await getScanners();
        setScannerNames(scannersList.map(s => s.scannerName));
        setTempConfig(config);
        setTempSelectedColor(colorMapping[config.color]);
        setSettingsShow(true);
    };

    const closeSettingsWindow = () => {
        setSettingsShow(false);
    };

    const handleSave = async () => {
        await saveConfig(tempConfig);
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
                size="md"
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
                    <hr/>

                    <Row className="mb-3">
                        <Col md={6}>
                            <SettingsDropdown
                                title="Разрешение"
                                data={resolutionOptions}
                                selected={tempConfig.dpi}
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
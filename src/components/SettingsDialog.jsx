import React, {useState} from 'react';
import {Modal, Row, Col, Form} from 'react-bootstrap';
import ButtonDefault from './buttonDefault/ButtonDefault';
import SettingsDropdown from './settingsDropdown/SettingsDropdown';
import {IoSettingsOutline} from "react-icons/io5";

const SettingsDialog = ({getScanners, config}) => {
    const [scanner, setScanner] = useState("");
    const [resolution, setResolution] = useState("");
    const [colorMode, setColorMode] = useState("");
    const [feeder, setFeeder] = useState(false);
    const [duplex, setDuplex] = useState(false);
    const [tempConfig, setTempConfig] = useState({});
    const [settingsShow, setSettingsShow] = useState(false);

    const scannerOptions = ["ScanJet 3000", "Canon DR"];
    const resolutionOptions = [100, 200, 300, 400, 500];
    const colorOptions = ["Оттенки серого", "Цветной", "Черно-белый"];

    const openSettingsWindow = async () => {
        await getScanners();
        setTempConfig(config);
        setSettingsShow(true);
    }

    const closeSettingsWindow = () => {
        setSettingsShow(false);
    }

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
                        data={scannerOptions}
                        selected={scanner}
                        onSelect={setScanner}
                    />
                    <hr/>

                    <Row className="mb-3">
                        <Col md={6}>
                            <SettingsDropdown
                                title="Разрешение"
                                data={resolutionOptions}
                                selected={resolution}
                                onSelect={setResolution}
                            />
                        </Col>
                        <Col md={6}>
                            <SettingsDropdown
                                title="Цветовой формат"
                                data={colorOptions}
                                selected={colorMode}
                                onSelect={setColorMode}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Check
                                id="feeder-checkbox"
                                type="checkbox"
                                label="Поточное сканирование"
                                checked={feeder}
                                onChange={() => setFeeder(!feeder)}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Check
                                id="duplex-checkbox"
                                type="checkbox"
                                label="Двустороннее"
                                checked={duplex}
                                onChange={() => setDuplex(!duplex)}
                                disabled={!feeder}
                            />
                        </Col>
                    </Row>

                    <small className="text-muted d-block mt-3">* обязательные для заполнения поля</small>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonDefault tooltip={"Сохранить"} onClick={closeSettingsWindow} text={"Сохранить"}></ButtonDefault>
                    <ButtonDefault tooltip={"Настройки"} onClick={closeSettingsWindow} text={"Отмена"}></ButtonDefault>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SettingsDialog;
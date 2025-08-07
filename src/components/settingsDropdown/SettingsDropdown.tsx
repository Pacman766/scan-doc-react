import React from 'react';
import { Dropdown } from "react-bootstrap";

interface SettingsDropdown {
    title: string;
    data: number[] | string[];
    selected: string | number | undefined;
    onSelect: (value: string) => void
}

const SettingsDropdown: React.FC<SettingsDropdown> = ({ title, data = [], selected, onSelect }) => {
    const handleSelect = (eventKey: string | null) => {
        if (eventKey){
            onSelect(eventKey);
        }
    }

    return (
        <Dropdown onSelect={handleSelect} data-bs-theme="dark">
            <Dropdown.Toggle id="dropdown-button-dark-example1" variant="secondary">
                {selected || title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item eventKey={title} active={selected === ''}>
                    — Не выбрано —
                </Dropdown.Item>
                {data.map((item, idx) => (
                    <Dropdown.Item
                        key={idx}
                        eventKey={item}
                        active={selected === item}
                    >
                        {item}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SettingsDropdown;

import React, {ReactNode} from 'react';
import {Button} from "react-bootstrap";

interface ButtonDefault {
    icon?: ReactNode;
    text?: string;
    tooltip?: string;
    onClick?: () => void;
    isDisabled?: boolean | undefined;
}

const ButtonDefault: React.FC<ButtonDefault> = ({icon, text, tooltip, onClick, isDisabled}) => {
    return (
        <Button
            className="d-flex align-items-center justify-content-center gap-2 mx-2 bg-transparent"
            size="sm"
            onClick={onClick}
            disabled={isDisabled}
            style={{minHeight: '31px' }}
        >
            {icon}
            {text}
        </Button>
    );
};

export default ButtonDefault;

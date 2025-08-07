import React, {ReactNode} from 'react';
import Button from 'react-bootstrap/Button';
import  './ButtonOutline.css'

type ButtonOutline = {
    icon?: ReactNode;
    tooltip?: string;
    onClick?: () => void;
    isDisabled?: boolean | undefined;
}

const ButtonOutline= ({icon, tooltip, onClick, isDisabled}: ButtonOutline) => {
    return (
        <Button
            title={tooltip}
            onClick={onClick}
            className="d-flex justify-content-center align-items-center mx-2 button-outline"
            disabled={isDisabled}
        >
            {icon}
        </Button>
    );
};

export default ButtonOutline;
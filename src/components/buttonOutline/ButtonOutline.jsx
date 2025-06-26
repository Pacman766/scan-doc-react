import React from 'react';
import Button from 'react-bootstrap/Button';
import  './ButtonOutline.css'


const ButtonOutline = ({icon, onClick, isDisabled, tooltip}) => {
    return (
        <Button
            tooltip={tooltip}
            onClick={onClick}
            className="d-flex justify-content-center align-items-center mx-2 button-outline"
            disabled={isDisabled}
        >
            {icon}
        </Button>
    );
};

export default ButtonOutline;
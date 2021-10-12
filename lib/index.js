import './index.css';
import React from 'react';
import DateTimePicker from './DatePicker.js';
import Modal from './Modal.js';

function EnhanceDateTimePicker({ isOpen, ...props }) {
    function onModalClose(event) {
        if (event.target === event.currentTarget) {
            props.onCancel();
        }
    }

    return (
        <div
            style={{ display: isOpen ? '' : 'none' }}
            onClick={onModalClose}
            className='datepicker-modal'>
            <DateTimePicker {...props} />
        </div>
    );
}


function ModalDateTimePicker({ isPopup, ...props }) {
    if (!isPopup) {
        return <DateTimePicker {...props} />;
    }

    return (
        <Modal {...props}>
            <EnhanceDateTimePicker />
        </Modal>
    );
}


ModalDateTimePicker.defaultProps = {
    isPopup: true,
    isOpen: false,
    theme: 'default',
    value: new Date(),
    min: new Date(1970, 3, 6),
    max: new Date(2050, 0, 1),
    dateFormat: ['YYYY', 'MM', 'DD'],
    onSelect: () => {},
    onCancel: () => {},
};

export default ModalDateTimePicker;

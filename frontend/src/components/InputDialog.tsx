// InputDialog.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface InputDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    onSetText?: (value: string) => void;
    title?: string;
    placeholder?: string;
    value?: string;
}

const InputDialog: React.FC<InputDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    title = 'Please enter text.',
    placeholder = 'Enter the text here...',
    value,
}) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleSave = () => {
        onSave(inputValue);
        setInputValue(''); // Empty the input box
        // onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Input Modal"
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    border: '3px solid #006400',
                    borderRadius: '4px',
                    width: '80%',
                    maxWidth: '500px'
                }
            }}
        >
            <h3 style={{
                textAlign: 'left'
            }}>{title}</h3>

            <textarea
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                rows={4}
                style={{
                    width: 'calc(100% - 20px)',
                    marginTop: '10px',
                    padding: '10px',
                    resize: 'none'
                }}
            />

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={onClose} style={{ marginRight: '10px' }}>Cancel</button>
                <button onClick={handleSave}>Ok</button>
            </div>
        </Modal>
    );
};

export default InputDialog;

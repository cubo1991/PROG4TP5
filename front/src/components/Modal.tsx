import React from 'react';

interface ModalProps {
  text: string;
  onClose?: () => void;
  isOpen?: boolean;
onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({ text, onClose, isOpen = true, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <p className="text-gray-800 text-center">{text}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            No
          </button>
        )}
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Sí
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;

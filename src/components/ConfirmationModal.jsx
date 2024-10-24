import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const ConfirmationModal = ({
  id,
  title,
  message,
  onConfirm,
  modalLoading
}) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <div className="flex mb-2 gap-2">
          <QuestionMarkCircleIcon className="size-8 text-primary" />
          <h3 className="font-bold text-lg mb-4">{title}</h3>
        </div>
        <p>{message}</p>
        <div className="modal-action">
          <div className="flex items-center">
            <button
              className="btn mr-2"
              onClick={() => document.getElementById(id).close()}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-primary text-base-100 ${modalLoading ? 'btn-disabled' : ''}`}
              onClick={onConfirm}
            >
              {modalLoading && <span className="loading loading-sm loading-spinner mr-2"></span>}
              {modalLoading ? 'Please wait...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;
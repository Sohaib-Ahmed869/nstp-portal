import React from 'react';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const DeleteConfirmationModal = ({
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
        <TrashIcon className="size-8 text-error" />
         <h3 className="font-bold text-lg mb-4">{title}</h3>
       </div>
        <p>{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn mr-2" onClick={() => document.getElementById(id).close()} >Cancel</button>
            <button
              type="button"
              className={`btn btn-error text-base-100 ${modalLoading ? 'loading' : ''}`}
              onClick={onConfirm}
              disabled={modalLoading}
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmationModal;